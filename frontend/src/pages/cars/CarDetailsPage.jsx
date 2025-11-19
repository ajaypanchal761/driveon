import { useParams } from 'react-router-dom';

/**
 * CarDetailsPage Component
 * Car details page - Mobile-optimized
 */
const CarDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container-mobile py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Car Details
        </h1>
        <p className="text-text-secondary mb-4">
          Car ID: {id}
        </p>
        <p className="text-text-secondary">
          Car details page - Coming soon
        </p>
      </div>
    </div>
  );
};

export default CarDetailsPage;

