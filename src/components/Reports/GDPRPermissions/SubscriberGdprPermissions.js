import React, { useState, useEffect, Fragment } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import * as S from './SubscriberGdpr.styles';

//TODO: Fix onClick event on 'a' tag with class 'dp-expand-results'

const SubscriberGdprPermissions = ({
  subscriber,
  dependencies: {
    dopplerApiClient,
    appConfiguration: { reportsUrl },
  },
}) => {
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  useEffect(() => {
    setState({ loading: true });
    if (!subscriber) {
      return;
    }
    const fetchData = async () => {
      const allFields = await dopplerApiClient.getUserFields();

      if (allFields.success) {
        const allPermissionFields = allFields.value.filter(
          (customField) => customField.type === 'permission' || customField.type === 'consent',
        );
        const subscriberPermissionFields = subscriber.fields.filter(
          (customField) => customField.type === 'permission' || customField.type === 'consent',
        );

        const fields = allPermissionFields.map((field) => {
          const found = subscriberPermissionFields.find(
            (subscriberField) => subscriberField.name === field.name,
          );
          field.value = found ? found.value : 'none';
          return field;
        });

        setState({
          loading: false,
          fields: fields,
        });
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, subscriber]);

  return (
    <>
    <div>
      <div className="dp-table-responsive">
        {state.loading ? (
          <Loading page />
        ) : (
          <table
            className="dp-c-table dp-nested-table"
            aria-label={_('subscriber_history.table_result.aria_label_table')}
            summary={_('subscriber_history.table_result.aria_label_table')}
          >
            <thead>
              <tr>
                <th scope="col">
                  <FormattedMessage id="subscriber_gdpr.permission_name" />
                </th>
                <th scope="col">
                  <FormattedMessage id="subscriber_gdpr.permission_description" />
                </th>
                <th scope="col">
                  <FormattedMessage id="subscriber_gdpr.permission_value" />
                </th>
              </tr>
            </thead>
            <tbody>
              {state.fields.length ? (
                <>
                  {state.fields.map((field, index) => (
                    <Fragment key={index}>
                    <tr>
                      <td>
                        <span>
                        <a href="#" className="dp-expand-results">
                          <i className="ms-icon icon-arrow-next"></i>
                        </a>
                        {field.name}
                        </span>
                      </td>
                      <td>
                        {field.permissionHTML ? (
                          <S.TextColumn
                            dangerouslySetInnerHTML={{ __html: field.permissionHTML }}
                          />
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

                    <tr className="dp-expanded-table">
                      <td className="dp-latest-results">
                        <span>"Ultimos 10 resultados"</span>
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
                            <tr>
                              <td>
                                  <span>
                                    <span className="ms-icon icon-lock dp-lock-green" />
                                    Aceptado
                                </span>
                              </td>
                              <td>
                                <span>200.5.229.58</span>
                              </td>
                              <td>
                                <span>22/12/2016</span>
                              </td>
                              <td>
                                <span>Formulario 3</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span>
                                  <span className="ms-icon icon-lock dp-lock-red" />
                                    Rechazado
                                  </span>
                              </td>
                              <td>
                                <span>200.5.229.58</span>
                              </td>
                              <td>
                                <span>22/12/2016</span>
                              </td>
                              <td>
                                <span>Formulario 1</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                  <span>
                                    <span className="ms-icon icon-lock dp-lock-grey" />
                                     Sin respuesta
                                  </span>
                              </td>
                              <td>
                                <span>200.5.229.58</span>
                              </td>
                              <td>
                                <span>22/12/2016</span>
                              </td>
                              <td>
                                <span>Formulario 2</span>
                              </td>
                          </tr>
                          </tbody>
                        </table>
                      </td>
                      <td />
                    </tr>
                    </Fragment>
                   ))}
                </>
              ) : (
                <tr>
                  <td>
                    <span className="bounceIn">
                      <FormattedMessage id="subscriber_gdpr.empty_data" />
                    </span>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
};

export default InjectAppServices(SubscriberGdprPermissions);
