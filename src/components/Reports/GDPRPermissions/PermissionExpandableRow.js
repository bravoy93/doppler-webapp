import React, { useState, useEffect } from 'react';
import * as S from './SubscriberGdpr.styles';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';

// TODO: Apply the internationalization

const PermissionValue = ({value}) => {
  const permissionValue = value.toLowerCase()
  let iconColor = permissionValue === 'none'
    ? 'grey'
    : permissionValue === 'true'
      ? 'green'
      : 'red'
  
  return (
    <>
      <span className={`ms-icon icon-lock dp-lock-${ iconColor }`} />
      <FormattedMessage id={`subscriber_gdpr.value_${ permissionValue }`} />
    </>
  )
}


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
  const [permissions, setPermissions] = useState(null)
  
  // TODO: Ask for the 'fieldName' param, where it comes from

  useEffect(() => {
    const fetchData = async () => {
      const fieldName = 'customField'
      const {success, value} = await dopplerApiClient.getSubscriberPermissionHistory({ email, fieldName })
      if (success) {
        setPermissions(value.items)
      }
      setLoading(false)
    }
    fetchData()
    return fetchData
  }, [dopplerApiClient])

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
          {field.value.toLowerCase() === 'none' ? (
            <div className="dp-icon-wrapper">
              <span className="ms-icon icon-lock dp-lock-grey"></span>
              <FormattedMessage id="subscriber_gdpr.value_none" />
            </div>
          ) : field.value.toLowerCase() === 'true' ? (
            <div className="dp-icon-wrapper">
              <span className="ms-icon icon-lock dp-lock-green"></span>
              <FormattedMessage id="subscriber_gdpr.value_true" />
            </div>
          ) : (
            <div className="dp-icon-wrapper">
              <span className="ms-icon icon-lock dp-lock-red"></span>
              <FormattedMessage id="subscriber_gdpr.value_false" />
            </div>
          )}
        </td>
      </tr>

      <tr className={`dp-expanded-table ${expanded && 'show'}`}>
        { loading ? (
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
          <span>"Últimos {permissions.length} resultados"</span>
        </td>
        <td className="dp-list-results">
          <table className="dp-table-results">
            <thead>
              <tr>
                <th aria-label="Consentimiento" scope="col">
                  <span>Consentimiento:</span>
                </th>
                <th aria-label="IP origen demodificación" scope="col">
                  <span>IP origen demodificación:</span>
                </th>
                <th aria-label="Fecha de modificación" scope="col">
                  <span>Fecha de modificación:</span>
                </th>
                <th aria-label="Formulario de origen" scope="col">
                  <span>Formulario de origen:</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.length && permissions.map(({value, originIP, date, originType}, i) => {
                return <tr key={i}>
                <td>
                  <PermissionValue value={value} />
                </td>
                <td>
                  {originIP}
                </td>
                <td>
                  <FormattedDate value={date} />
                </td>
                <td>
                  <span>{originType}</span>
                </td>
              </tr>
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
  field: PropTypes.object
}

export default InjectAppServices(PermissionExpandableRow);