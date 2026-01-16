type ProductCardProps = {
  name: string;
  price: string;
  status: string;
};

const ProductCard = ({ name, price, status }: ProductCardProps) => (
  <div className='card shadow-sm h-100'>
    <div className='card-body d-flex flex-column gap-2'>
      <h3 className='h5 mb-0'>{name}</h3>
      <p className='text-secondary mb-1'>Perfect for small teams.</p>
      <div className='d-flex align-items-center justify-content-between'>
        <span className='badge text-bg-info'>{status}</span>
        <span className='fw-semibold'>{price}</span>
      </div>
      <button className='btn btn-primary mt-2'>Start trial</button>
    </div>
  </div>
);

export default function ComponentsPropsExample() {
  return (
    <div className='row g-3'>
      <div className='col-12 col-md-6'>
        <ProductCard name='Starter Pack' price='$12/mo' status='Popular' />
      </div>
      <div className='col-12 col-md-6'>
        <ProductCard name='Growth Pack' price='$29/mo' status='Recommended' />
      </div>
    </div>
  );
}
