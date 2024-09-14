'use client';

import { Divider } from '@nextui-org/divider';
import { m } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId, useMemo, useState, useTransition } from 'react';

import { RowSteps } from '@/components/layout/row-steps';
import { useViewport } from '@/providers/viewport';
import { cn } from '@/utils/cn';

import { ProductCustomizer, ProductCustomizerMobile } from '../product-customizer';
import { ProductDrawer } from '../product-drawer';
import { ProductSelector } from '../product-selector';
import { Summary } from '../summary';

export const STEPS = [{ title: 'Fabric' }, { title: 'Shirt' }, { title: 'Summary' }];

function Configurator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, isTablet } = useViewport();

  const [currentStep, setCurrentStep] = useState(parseInt(searchParams.get('step') || '0', 10));
  const [isPending, startTransition] = useTransition();

  function handleStepChange(newStep: number) {
    if (newStep < 0 || newStep >= STEPS.length) return;

    startTransition(() => {
      const updatedSearch = new URLSearchParams(searchParams);

      updatedSearch.set('step', newStep.toString());
      const newUrl = `${pathname}?${updatedSearch.toString()}`;

      router.push(newUrl);
      setCurrentStep(newStep);
    });
  }

  const handleNext = () => handleStepChange(currentStep + 1);
  const handlePrevious = () => handleStepChange(currentStep - 1);

  const stepComponents = useMemo(
    () => [
      <ProductSelector key='selector' />,
      isMobile ? <ProductCustomizerMobile key='customizerMobile' /> : <ProductCustomizer key='customizer' />,
      <Summary key='summary' handleStepChange={handleStepChange} />,
    ],
    [isMobile, handleStepChange]
  );

  return (
    <div className='w-full justify-start h-screen overflow-hidden flex flex-col md:grid md:grid-cols-2 relative overflow-y-hidden'>
      <div className='mt-[calc(var(--nav-height)+2.627rem)] h-[calc(35*var(--vh))] xxxl:mt-[calc(100vh-var(--drawer-height)-1px)] xxxl:h-[calc(var(--drawer-height)+1px)] xxxl:bg-[#efefef] xxxl:dark:bg-[#0b0b24]' />
      <Divider className='md:hidden' />
      {isMobile ||
        (isTablet && (
          <div className='absolute top-navbarHeight h-[2.625rem] w-full'>
            <m.div
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: -100 }}
            >
              <Divider />
              <RowSteps
                currentStep={currentStep}
                stepClassName='p-2 uppercase'
                steps={STEPS}
                onStepChange={handleStepChange}
              />
              <Divider />
            </m.div>
          </div>
        ))}
      <m.div
        key={useId()}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'h-[calc(65*var(--vh)-var(--drawer-height)-var(--nav-height)-2rem-1px)] md:h-[calc(100vh-var(--drawer-height)-var(--nav-height))] xxl:h-[calc(100vh-var(--nav-height))]',
          'md:ml-2 md:mt-navbarHeight px-[2.4vw] md:px-[1.4vw] xl:px-[1vw]',
          'xxxl:[&>*:last-child]:pb-[calc(var(--drawer-height)+4rem)]',
          { 'px-0': isMobile && currentStep === 1 }
        )}
        exit={{ opacity: 0, y: 100, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, x: 200 }}
        transition={{ delay: 0.1, duration: 0.7 }}
      >
        {!isMobile && !isTablet && <RowSteps currentStep={currentStep} steps={STEPS} onStepChange={handleStepChange} />}
        {isPending ? (
          <div className='flex items-center justify-center h-full'>
            <p>Loading...</p>
          </div>
        ) : (
          stepComponents[currentStep]
        )}
      </m.div>
      <m.div
        key={useId()}
        animate={{ opacity: 1, bottom: 0, transition: { delay: 0.2, duration: 0.7 } }}
        className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[105rem] mx-auto !bg-background z-20 rounded-t-medium overflow-hidden overflow-y-scroll max-h-[calc(82*var(--vh))] shadow-large scrollbar-hide dark:border dark:border-b-0 dark:border-divider'
        exit={{ opacity: 0 }}
        initial={{ opacity: 0, bottom: -200 }}
      >
        <ProductDrawer currentStep={currentStep} handleNext={handleNext} handlePrevious={handlePrevious} />
      </m.div>
    </div>
  );
}

export { Configurator };
