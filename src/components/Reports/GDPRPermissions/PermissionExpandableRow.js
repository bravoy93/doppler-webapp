import React, { useState } from 'react';
import * as S from './SubscriberGdpr.styles';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

// TODO: Apply the internacionalization

const PermissionExpandableRow = ({ field }) => {
  const [expanded, setExpanded] = useState(false);
  
  // TODO: Fetch the permission history in onComponentDidMount lifecycle

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
    </>
  );
};

PermissionExpandableRow.propTypes = {
  field: PropTypes.object
}

export default PermissionExpandableRow;
