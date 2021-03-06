import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import SubscriberSentCampaigns from './SubscriberSentCampaigns';

describe('SubscriberSentCampaigns component', () => {
  afterEach(cleanup);

  const campaignDeliveryCollection = {
    items: [
      {
        campaignId: 1,
        campaignName: 'Campaña estacional de primavera',
        campaignSubject: '¿Como sacarle provecho a la primavera?',
        deliveryStatus: 'opened',
        clicksCount: 2,
        urlImgPreview: '',
      },
    ],
    currentPage: 0,
    itemsCount: 1,
    pagesCount: 1,
  };

  const subscriber = {
    email: 'test@test.com',
    fields: [
      {
        name: 'FIRSTNAME',
        value: 'Manuel',
        predefined: true,
        private: true,
        readonly: true,
        type: 'boolean',
      },
    ],
    unsubscribedDate: '2019-11-27T18:05:40.847Z',
    unsubscriptionType: 'hardBounce',
    manualUnsubscriptionReason: 'administrative',
    unsubscriptionComment: 'test',
    status: 'active',
    score: 0,
  };

  it('should show subscriber campaigns deliveries', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <SubscriberSentCampaigns subscriber={subscriber} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() =>
      expect(getByText('¿Como sacarle provecho a la primavera?')).toBeInTheDocument(),
    );
  });

  it('should show empty message', async () => {
    // Arrange
    const campaignDeliveryCollection = {
      items: [],
      currentPage: 0,
      itemsCount: 1,
      pagesCount: 1,
    };
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <SubscriberSentCampaigns subscriber={subscriber} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => expect(getByText('subscriber_history.empty_data')).toBeInTheDocument());
  });

  it('should show soft and hard bounced delivery status', async () => {
    // Arrange
    const campaignDeliveryCollection = {
      items: [
        {
          campaignId: 1,
          campaignName: 'Campaña estacional de primavera',
          campaignSubject: '¿Como sacarle provecho a la primavera?',
          deliveryStatus: 'softBounced',
          clicksCount: 2,
          urlImgPreview: '',
        },
        {
          campaignId: 2,
          campaignName: 'Campaña estacional de primavera',
          campaignSubject: '¿Como sacarle provecho a la primavera?',
          deliveryStatus: 'hardBounced',
          clicksCount: 2,
          urlImgPreview: '',
        },
        {
          campaignId: 3,
          campaignName: 'Campaña estacional de primavera',
          campaignSubject: '¿Como sacarle provecho a la primavera?',
          deliveryStatus: 'opened',
          clicksCount: 2,
          urlImgPreview: '',
        },
        {
          campaignId: 4,
          campaignName: 'Campaña estacional de primavera',
          campaignSubject: '¿Como sacarle provecho a la primavera?',
          deliveryStatus: 'notOpened',
          clicksCount: 2,
          urlImgPreview: '',
        },
      ],
      currentPage: 1,
      itemsCount: 4,
      pagesCount: 1,
    };
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <SubscriberSentCampaigns subscriber={subscriber} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => {
      expect(getByText('subscriber_history.delivery_status.softBounced')).toBeInTheDocument();
      expect(getByText('subscriber_history.delivery_status.hardBounced')).toBeInTheDocument();
      expect(getByText('subscriber_history.delivery_status.opened')).toBeInTheDocument();
      expect(getByText('subscriber_history.delivery_status.notOpened')).toBeInTheDocument();
    });
  });

  it('should load campaign preview img', async () => {
    // Arrange
    const campaignDeliveryCollection = {
      items: [
        {
          campaignId: 1,
          campaignName: 'Campaña estacional de primavera',
          campaignSubject: '¿Como sacarle provecho a la primavera?',
          deliveryStatus: 'softBounced',
          clicksCount: 2,
          urlImgPreview:
            'http://dopplerfilesint.fromdoppler.net/Users/50018/Campaigns/33850437/33850437.png',
        },
      ],
      currentPage: 1,
      itemsCount: 4,
      pagesCount: 1,
    };
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    // Act
    const { container } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <SubscriberSentCampaigns subscriber={subscriber} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-tooltip-block')).toBeInTheDocument();
    });
  });

  it('should load campaign without preview img', async () => {
    // Arrange
    const campaignDeliveryCollection = {
      items: [
        {
          campaignId: 1,
          campaignName: 'Campaña estacional de primavera',
          campaignSubject: '¿Como sacarle provecho a la primavera?',
          deliveryStatus: 'softBounced',
          clicksCount: 2,
          urlImgPreview: '',
        },
      ],
      currentPage: 1,
      itemsCount: 4,
      pagesCount: 1,
    };
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    // Act
    const { container } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <SubscriberSentCampaigns subscriber={subscriber} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-tooltip-block')).not.toBeInTheDocument();
    });
  });
});
