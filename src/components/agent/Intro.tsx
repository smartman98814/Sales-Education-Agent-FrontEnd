'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { useCbAgents } from '@/context';
import { useRouter } from '@/i18n/navigation';

import { ButtonBlue, ButtonOrange } from '../button';
import { Motion } from '../common';
import { CBLogoIcon, CBLogoText, ForwardIcon } from '../svg';

const StepOneItems = [
  {
    title: 'Iterate at the\n Speed of Thought',
    titleLong: 'Iterate at the\n Speed of Thought',
    desc: "Visualize your agent's memory, reasoning steps, and tool calls to understand their decision making, and make edits to their state in real time.",
    img: '/images/chatandbuild/step1-speed.webp',
  },
  {
    title: 'No Context\n Window Overflow',
    titleLong: 'No More Context Window Overflow',
    desc: 'Overstuffed context windows confuse agents and degrade reasoning. ChatAndBuild Agents maximizes agent performance by compiling the most relevant information to pass to the LLM, while keeping token counts under a specified budget.',
    img: '/images/chatandbuild/step1-nocontext.webp',
  },
  {
    title: '90M+\n Data Sources',
    titleLong: 'Powered by 90M+ Data Sources',
    desc: 'Access comprehensive competitive intelligence with real-time data from millions of sources, giving your agents the knowledge they need to provide accurate, up-to-date insights.',
    img: '/images/chatandbuild/step1-data.webp',
  },
];

export const Intro = () => {
  const { setCompletedIntro, introStep, setIntroStep } = useCbAgents();
  const router = useRouter();

  const completeIntro = () => {
    setCompletedIntro(true);
    router.push('/');
  };

  const renderStep = (index: number) => {
    const { title, titleLong, desc, img } = StepOneItems[introStep - 1];

    return (
      <div className="space-y-2.5">
        <div className="font-grotesk font-bold text-gray-350 text-[15px]">
          <Motion.span className="text-orange-500" delay={0.2}>
            {index + 1}
          </Motion.span>{' '}
          <span className="font-normal">/</span> 4
        </div>
        <div className="flex flex-col-reverse md:grid grid-cols-2" key={index}>
          <div className="flex flex-col gap-4 justify-between">
            <Motion.div className="font-tektur text-[32px] leading-none font-semibold uppercase">
              {titleLong}
            </Motion.div>
            <Motion.div className="font-grotesk text-lg text-gray-350" delay={0.2}>
              {desc}
            </Motion.div>
          </div>
          <div className="flex items-center justify-center pb-5 md:p-4">
            <Image src={img} width={272} height={272} alt={title} />
          </div>
        </div>
      </div>
    );
  };

  const goNextStep = (isNextStep = true) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setIntroStep(introStep + (isNextStep ? 1 : -1));
  };

  return (
    <div className="absolute z-50 top-0 left-0 h-fit md:h-dvh md:min-h-[756px] w-full bg-black-light bg-[url('/images/landing/coming-bg.svg')] flex flex-col items-center justify-between gap-4 text-white overflow-hidden">
      <div className="w-full grow flex items-center">
        <div className="w-full px-4 py-8">
          {/* header */}
          <Motion.div className="flex items-center justify-center gap-2.5 mb-10">
            <CBLogoIcon className="h-8" />
            <CBLogoText className="h-6" />
            <span className="p-1 leading-none bg-orange-500/15 border border-orange-500/30 uppercase border-box text-orange-500 font-tektur text-sm font-semibold">
              Agents
            </span>
          </Motion.div>
          {/* Content card */}
          <div className="w-full max-w-[818px] mx-auto border border-white/15 bg-gray-800/75">
            {/* Pagination */}
            <div className="w-full px-3 grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }, (_, i) => i).map((index) => (
                <button
                  key={index}
                  className={twMerge('cursor-pointer py-3')}
                  onClick={() => setIntroStep(index)}
                >
                  <div
                    className={twMerge(
                      'w-full rounded-full h-1',
                      index <= introStep ? 'bg-orange-500' : 'bg-white/25',
                    )}
                  />
                </button>
              ))}
            </div>
            {/* Content */}
            <div className="p-6 flex min-h-[396px]">
              {introStep === 0 && (
                <div className="flex flex-col justify-between gap-5">
                  <div className="space-y-5 md:grid md:grid-cols-2">
                    <div className="space-y-2.5">
                      <div className="font-grotesk font-bold text-gray-350 text-[15px]">
                        <Motion.span className="text-orange-500" delay={0.2}>
                          1
                        </Motion.span>{' '}
                        <span className="font-normal">/</span> 4
                      </div>
                      <Motion.div className="font-tektur text-[32px] leading-none font-semibold uppercase">
                        Welcome to
                        <br />
                        Chat and build agents
                      </Motion.div>
                    </div>
                    <Motion.div className="md:pl-4 font-grotesk text-lg text-gray-350" delay={0.2}>
                      Build agents at the speed of thought that come with infinite context, powered
                      by intelligence from 90M+ data sources.
                    </Motion.div>
                  </div>
                  <div className="space-y-4 md:grid md:grid-cols-3 gap-2 overflow-hidden">
                    {StepOneItems.map(({ title, img }, index) => (
                      <Motion.div
                        key={index}
                        className="relative bg-gray-800 rounded-lg border border-white/15 pt-32 px-3.5 pb-3.5"
                        initial={{ x: 16, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        delay={0.2 * index}
                      >
                        <div className="absolute top-0 right-0 w-fit h-fit">
                          <Image src={img} width={140} height={140} alt={title} />
                        </div>
                        <div className="font-grotesk leading-none text-base font-medium uppercase text-white">
                          {title.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </div>
              )}
              {introStep === 1 && renderStep(1)}
              {introStep === 2 && renderStep(2)}
              {introStep === 3 && renderStep(3)}
            </div>
          </div>
          {/* Next, Prev */}
          <div className="mt-8 flex flex-col-reverse md:flex-row gap-y-0 items-center justify-center">
            {introStep > 0 && (
              <ButtonBlue
                className="px-28"
                innerClassName="shadow-none"
                onClick={() => goNextStep(false)}
              >
                <div className="flex items-center gap-2.5 font-tektur font-semibold text-base uppercase text-shadow-sm text-shadow-black/25">
                  <ForwardIcon className="text-white rotate-180" />
                  Prev
                </div>
              </ButtonBlue>
            )}
            <ButtonOrange
              className="w-fit"
              innerClassName="shadow-none"
              contentClassName="py-2 px-28"
              onClick={() => {
                if (introStep < 3) {
                  goNextStep(true);
                  return;
                }
                completeIntro();
              }}
            >
              <div className="flex items-center gap-2.5 font-tektur font-semibold text-base uppercase text-shadow-sm text-shadow-black/25">
                Next
                <ForwardIcon className="text-white" />
              </div>
            </ButtonOrange>
          </div>
        </div>
      </div>
      {/* Skip Intro */}
      <div className="mb-10">
        <button
          className="cursor-pointer outline-none font-grotesk text-gray-350 border-b border-gray-350 text-base/4.5"
          onClick={completeIntro}
        >
          Skip intro
        </button>
      </div>

      {/* BG lines */}
      <div className="absolute left-[calc(50%-620px)] w-px h-full bg-white/10" />
      <div className="absolute right-[calc(50%-620px)] w-px h-full bg-white/10" />
      <div className="absolute left-[calc(50%-408px)] w-px h-full bg-white/10" />
      <div className="absolute right-[calc(50%-408px)] w-px h-full bg-white/10" />
    </div>
  );
};
