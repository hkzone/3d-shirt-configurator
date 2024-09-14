import { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';

import { subtitle } from '@/components/common/primitives';
import { CoverFlowSlider } from '@/components/common/slider';
import { useSelectedProduct } from '@/hooks/api/use-selected-product';
import { listenForOutsideClicks } from '@/utils/listen-for-outside-clicks';
import { Product } from '@/types/product';

import { STEPS } from '../configurator';

interface ProductDrawerProps {
  handleNext: () => void;
  handlePrevious: () => void;
  currentStep: number;
}

export function ProductDrawer({ handleNext, handlePrevious, currentStep }: ProductDrawerProps) {
  const { selectedProduct, isLoading, error } = useSelectedProduct();
  const accordionRef = useRef(null);
  const [selectedKeys, setSelectedKeys] = useState<Iterable<string>>(new Set());
  const [listening, setListening] = useState(false);

  const imagesData = useMemo(
    () => selectedProduct?.images.map(({ url, alt }) => ({ src: url, alt })),
    [selectedProduct]
  );

  useEffect(
    listenForOutsideClicks(listening, setListening, accordionRef, () => {
      setSelectedKeys(new Set());
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!selectedProduct) return null;

  return (
    <div className='w-full relative'>
      <Accordion
        ref={accordionRef}
        fullWidth
        className='flex-1 [&>div>h2]:h-[calc(var(--drawer-height)-2rem)]'
        hideIndicator={true}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(new Set(keys as string))}
      >
        <AccordionItem
          key='1'
          aria-label={selectedProduct.information.title}
          className='p-3 sm:p-4'
          startContent={<ProductHeader product={selectedProduct} />}
          title=''
        >
          <Divider className='mb-4' />
          <ProductContent imagesData={imagesData} product={selectedProduct} />
        </AccordionItem>
      </Accordion>
      <NavigationButtons currentStep={currentStep} handleNext={handleNext} handlePrevious={handlePrevious} />
    </div>
  );
}

function ProductHeader({ product }: { product: Product }) {
  return (
    <div className='flex h-[calc(var(--drawer-height)-2rem)] sm:h-20 md:w-[calc(100vw-184px)] sm:w-[calc(100vw-264px)]'>
      <div className='flex flex-col md:gap-1 items-start ml-0'>
        <div className='max-sm:text-sm max-sm:h-[2lh] max-sm:flex max-sm:items-end font-bold text-left'>
          {product.information.title}
        </div>
        <div className='font-light text-default-700'>{product.information.pattern}</div>
        <div className='font-bold'>{product.price}</div>
      </div>
    </div>
  );
}

function ProductContent({
  product,
  imagesData,
}: {
  product: Product;
  imagesData: { src: string; alt: string }[] | undefined;
}) {
  return (
    <div className='flex flex-col lg:flex-row gap-5 pb-8 overflow-hidden'>
      <div className='flex w-full lg:w-[calc(min(90vh,64vw)+2rem)]'>
        {imagesData && <CoverFlowSlider data={imagesData} />}
      </div>
      <div className='flex flex-col flex-[0] md:pl-4 h-3/4 flex-grow max-w-xl'>
        <ProductDescription product={product} />
        <ProductDetails product={product} />
      </div>
    </div>
  );
}

function ProductDescription({ product }: { product: Product }) {
  return (
    <div>
      <h5 className={subtitle({ class: 'font-bold' })}>Description</h5>
      <p>{product.information.description}</p>
      <div className='mt-8'>
        <span className='font-bold'>Composition:&nbsp;</span>
        <span>{product.information.composition}</span>
      </div>
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <div>
      <div className='mt-8'>
        <span className='font-bold'>Product SKU:&nbsp;</span>
        <span>{product.sku}</span>
      </div>
      <div className='mt-1'>
        <span className='font-bold'>Material SKU:&nbsp;</span>
        <span>{product.materialSku}</span>
      </div>
    </div>
  );
}

function NavigationButtons({ currentStep, handleNext, handlePrevious }: ProductDrawerProps) {
  return (
    <div className='absolute flex top-[calc(var(--drawer-height)-3.75rem)] md:top-[calc(var(--drawer-height)/2-1.25rem)] right-8 gap-4'>
      <Button
        className='z-20 max-sm:hidden'
        color='primary'
        isDisabled={currentStep === 0}
        variant='ghost'
        onPress={handlePrevious}
      >
        Previous
      </Button>
      <Button
        className='z-20'
        color='primary'
        isDisabled={currentStep === STEPS.length - 1}
        variant='ghost'
        onPress={handleNext}
      >
        Next
      </Button>
    </div>
  );
}
