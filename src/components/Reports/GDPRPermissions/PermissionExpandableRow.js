import React, { useState, useEffect } from 'react';
import * as S from './SubscriberGdpr.styles';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';

const PermissionValue = ({ value }) => {
  const permissionValue = value.toLowerCase();
  let iconColor =
    permissionValue === 'none' ? 'grey' : permissionValue === 'true' ? 'green' : 'red';

  return (
    <div className="dp-icon-wrapper">
      <span className={`ms-icon icon-lock dp-lock-${iconColor}`} />
      <FormattedMessage id={`subscriber_gdpr.value_${permissionValue}`} />
    </div>
  );
};

const PermissionExpandableRow = ({
  field,
  email,
  dependencies: {
    dopplerApiClient,
    appConfiguration: { reportsUrl },
  },
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);

  // TODO: Ask for the 'fieldName' param, where it comes from

  useEffect(() => {
    const fetchData = async () => {
      const fieldName = 'customField';
      const { success, value } = await dopplerApiClient.getSubscriberPermissionHistory({
        email,
        fieldName,
      });
      if (success) {
        setPermissions(value.items);
      }
      setLoading(false);
    };
    fetchData();
    return fetchData;
  }, [dopplerApiClient]);

  /**
   * Toggle the expanded state of the row
   */
  const toggleExpanded = (e) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <>
      <tr>
        <td>
          <span>
            <a
              href="#"
              onClick={toggleExpanded}
              className={`dp-expand-results ${expanded && 'dp-open-results'}`}
            >
              <i className="ms-icon icon-arrow-next"></i>
            </a>
            {field.name}
          </span>
        </td>
        <td>
          {field.permissionHTML ? (
            <S.TextColumn dangerouslySetInnerHTML={{ __html: field.permissionHTML }} />
          ) : (
            <FormattedMessage id="subscriber_gdpr.empty_html_text" />
          )}
        </td>
        <td>
          <PermissionValue value={field.value} />
        </td>
      </tr>

      <tr className={`dp-expanded-table ${expanded && 'show'}`}>
        {loading ? (
          <>
            <td />
            <td>
              <S.EmptyBox>
                <Loading />
              </S.EmptyBox>
            </td>
            <td />
          </>
        ) : (
          <>
            <td className="dp-latest-results">
              <FormattedMessage
                id="subscriber_gdpr.latest_results"
                tagName="span"
                values={{
                  results_amount: permissions.length,
                }}
              />
            </td>
            <td className="dp-list-results">
              <table className="dp-table-results">
                <thead>
                  <tr>
                    <th aria-label={_('subscriber_gdpr.consent')} scope="col">
                      <FormattedMessage id="subscriber_gdpr.consent" tagName="span" />:
                    </th>
                    <th aria-label={_('subscriber_gdpr.modification_source_ip')} scope="col">
                      <FormattedMessage
                        id="subscriber_gdpr.modification_source_ip"
                        tagName="span"
                      />
                      :
                    </th>
                    <th aria-label={_('subscriber_gdpr.modification_date')} scope="col">
                      <FormattedMessage id="subscriber_gdpr.modification_date" tagName="span" />:
                    </th>
                    <th aria-label={_('subscriber_gdpr.source_form')} scope="col">
                      <FormattedMessage id="subscriber_gdpr.source_form" tagName="span" />:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.length &&
                    permissions.map(({ value, originIP, date, originType }, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <PermissionValue value={value} />
                          </td>
                          <td>{originIP}</td>
                          <td>
                            <FormattedDate value={date} />
                          </td>
                          <td>
                            <FormattedMessage
                              id={`subscriber_gdpr.origin_type.${
                                originType.toLowerCase().startsWith('form') ? 'form' : 'manually'
                              }`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </td>
            <td />
          </>
        )}
      </tr>
    </>
  );
};

PermissionExpandableRow.propTypes = {
  field: PropTypes.object,
};

export default InjectAppServices(PermissionExpandableRow);
