'use client';

import { StatsigProvider } from '@statsig/react-bindings';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

import { APP_ENV, queryClient } from '@/configs';
import {
  BinanceWalletProvider,
  CbAgentsProvider,
  ThirdwebAuthProvider,
  ThirdwebProvider,
} from '@/context';

import { TooltipProvider } from '../common';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const clientKey = APP_ENV.NEXT_PUBLIC_STATSIG_CLIENT_KEY;
  const environment = APP_ENV.IS_PROD ? 'production' : 'development';

  return (
    <CbAgentsProvider>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <BinanceWalletProvider>
            <StatsigProvider
              sdkKey={clientKey}
              user={{ userID: 'anynomous' }}
              options={{
                plugins: [new StatsigAutoCapturePlugin()],
                environment: { tier: environment },
              }}
            >
              <ThirdwebAuthProvider>
                <TooltipProvider>
                  {children}
                  <ToastContainer />
                </TooltipProvider>
              </ThirdwebAuthProvider>
            </StatsigProvider>
          </BinanceWalletProvider>
        </ThirdwebProvider>
      </QueryClientProvider>
    </CbAgentsProvider>
  );
};
