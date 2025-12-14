'use client';

import { Icon } from '@iconify/react';
import { Variants, cubicBezier, motion } from 'framer-motion';
import React from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Motion } from '@/components/common';
import { CBLogoIcon, CBLogoText } from '@/components/svg';
import { useAuth } from '@/context';
import { Link, usePathname } from '@/i18n/navigation';

import 'react-modern-drawer/dist/index.css';

const menuVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden',
    right: '-100%',
    transition: {
      duration: 0.2,
      ease: cubicBezier(0.4, 0, 0.2, 1),
    },
  },
  open: {
    opacity: 1,
    visibility: 'initial',
    right: 0,
    maxWidth: 'none',
    transition: {
      duration: 0.2,
      ease: cubicBezier(0.4, 0, 0.2, 1),
    },
  },
} satisfies Variants;

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, openSignInDialog, signOut, isAuthenticated } = useAuth();

  const [showMenuDrawer, setShowMenuDrawer] = useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 w-full h-16 z-30 bg-gradient-to-r from-slate-800/95 via-gray-900/95 to-black-light/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="w-full max-w-[90rem] mx-auto text-white flex gap-3 items-center justify-between px-4 md:px-6">
          <Motion.div
            className="flex items-center gap-2.5 h-16"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <CBLogoIcon />
              <CBLogoText />
            </Link>
            <Motion.span
              className="p-1 leading-none bg-orange-500/15 border border-orange-500/30 uppercase border-box text-orange-500 font-tektur text-xs font-bold"
              delay={0.4}
            >
              Agents
            </Motion.span>
          </Motion.div>
          <Motion.div className="flex gap-3 md:gap-6 items-center" transition={{ delay: 0.5, duration: 0.2 }}>
            {/* <div className="flex items-center">
                <NotificationBtn hasNotifications={true} />
              </div> */}
            <div className="hidden md:flex items-center gap-6">
              {/* Sign In / Sign Out Button */}
              {isAuthenticated && user?.address !== 'guest' ? (
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon icon="heroicons:arrow-right-on-rectangle" className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={openSignInDialog}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon icon="heroicons:arrow-right-on-rectangle" className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Sign In Button */}
              {isAuthenticated && user?.address !== 'guest' ? (
                <button
                  onClick={() => signOut()}
                  className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <Icon icon="heroicons:arrow-right-on-rectangle" className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={openSignInDialog}
                  className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  title="Sign In"
                >
                  <Icon icon="heroicons:arrow-right-on-rectangle" className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => setShowMenuDrawer((flag) => !flag)}>
                <Icon
                  icon={!showMenuDrawer ? 'icon-park-outline:hamburger-button' : 'ic:round-close'}
                  className="text-white w-8 h-8"
                />
              </button>
            </div>
          </Motion.div>
          {showMenuDrawer && (
            <motion.div
              key={showMenuDrawer ? 'open' : 'closed'}
              initial={'closed'}
              animate={showMenuDrawer ? 'open' : 'closed'}
              variants={menuVariants}
              className={twMerge(
                'flex flex-col w-full md:w-[300px] fixed top-16 h-[calc(100%-64px)] p-4 md:p-6 bg-gradient-to-b from-slate-800/95 via-gray-900/95 to-black-light/95 backdrop-blur-lg text-gray-400 shadow shadow-white/30',
              )}
            >
              <nav className="pb-4 border-b border-white/15">
                <ul className="flex flex-col gap-4 font-grotesk font-medium">
                  {[
                    { title: 'My Agents', link: '/agents', target: '_self' },
                  ].map((menu, index) => (
                    <motion.li
                      key={index}
                      initial={{ y: -20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.1 }}
                      className={twMerge(
                        'relative h-12 flex items-center font-grotesk font-medium text-base',
                        pathname === menu.link
                          ? 'text-orange-500 pl-3'
                          : 'text-white hover:text-orange-500/80',
                      )}
                    >
                      <Link
                        key={index}
                        href={menu.link}
                        target={menu.target}
                        className="w-full h-full flex items-center"
                        onClick={() => setShowMenuDrawer(false)}
                      >
                        {menu.title}
                      </Link>
                      <div
                        className={twMerge(
                          'absolute left-0 top-0 w-1 h-full rounded-r-full transition-all duration-200',
                          pathname === menu.link
                            ? 'bottom-0 bg-orange-500'
                            : '-bottom-1 bg-transparent',
                        )}
                      />
                    </motion.li>
                  ))}
                </ul>
              </nav>
              {/* Sign In / Sign Out Button in Mobile Menu */}
              <div className="pt-4 border-t border-white/15">
                {isAuthenticated && user?.address !== 'guest' ? (
                  <button
                    onClick={() => {
                      signOut();
                      setShowMenuDrawer(false);
                    }}
                    className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="heroicons:arrow-right-on-rectangle" className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openSignInDialog();
                      setShowMenuDrawer(false);
                    }}
                    className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="heroicons:arrow-right-on-rectangle" className="w-5 h-5" />
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </header>
    </>
  );
};
