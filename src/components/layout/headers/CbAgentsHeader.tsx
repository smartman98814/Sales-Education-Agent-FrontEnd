'use client';

import { Icon } from '@iconify/react';
import { Variants, cubicBezier, motion } from 'framer-motion';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Motion } from '@/components/common';
import { CBLogoIcon, CBLogoText } from '@/components/svg';
import { CB_HEADER_NAVS } from '@/constants';
import { Link, usePathname } from '@/i18n/navigation';

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

export const CbAgentsHeader = () => {
  const pathname = usePathname();

  const [showMenuDrawer, setShowMenuDrawer] = useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 w-full h-16 z-30 bg-black-light border-b border-white/15">
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
          <nav className="hidden lg:block px-3">
            <ul className="flex gap-8 xl:gap-15 font-grotesk font-medium">
              {CB_HEADER_NAVS.map((menu, index) => (
                <motion.li
                  key={index}
                  initial={{ y: -20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={
                    pathname !== menu.link ? { y: -1, transition: { duration: 0.1 } } : {}
                  }
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.1 }}
                  className={twMerge(
                    'relative h-16 flex items-center font-grotesk font-medium text-base',
                    pathname === menu.link
                      ? 'text-orange-500'
                      : 'text-gray-350 hover:text-orange-500/60',
                  )}
                >
                  <Link
                    key={index}
                    href={menu.link}
                    target={menu.target}
                    className="w-full h-full flex items-center"
                  >
                    {menu.title}
                  </Link>
                  <div
                    className={twMerge(
                      'absolute left-0 bottom-0 w-full h-1 rounded-t-full transition-all duration-200',
                      pathname === menu.link
                        ? 'bottom-0 bg-orange-500'
                        : '-bottom-1 bg-transparent',
                    )}
                  />
                </motion.li>
              ))}
            </ul>
          </nav>
          <Motion.div className="flex gap-3 md:gap-6" transition={{ delay: 0.5, duration: 0.2 }}>
            {/* <div className="flex items-center">
              <NotificationBtn hasNotifications={true} />
            </div> */}
            <div className="hidden md:flex items-center">
              {/* Auth removed - using email/password auth */}
            </div>
            <div className="flex lg:hidden items-center">
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
                'flex flex-col w-full md:w-[300px] fixed top-16 h-[calc(100%-64px)] p-4 md:p-6 bg-black-light/30 backdrop-blur-lg text-gray-400 shadow shadow-white/30',
              )}
            >
              <nav className="pb-4 border-b border-white/15">
                <ul className="flex flex-col gap-4 font-grotesk font-medium">
                  {CB_HEADER_NAVS.map((menu, index) => (
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
                          : 'text-gray-350 hover:text-orange-500/60',
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
              {/* Auth removed - using email/password auth */}
            </motion.div>
          )}
        </div>
      </header>
    </>
  );
};
