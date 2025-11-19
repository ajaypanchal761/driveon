import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/common';

/**
 * HomePage Component
 * Landing page - Mobile-optimized
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container-mobile py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            DriveOn
          </h1>
          <p className="text-xl text-text-secondary">
            Your Car Rental Solution
          </p>
        </header>

        <div className="space-y-8">
          <section className="text-center">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Welcome to DriveOn
            </h2>
            <p className="text-text-secondary mb-6">
              Find and rent the perfect car for your journey
            </p>
            <Link to="/cars">
              <Button variant="primary" size="lg" fullWidth className="md:w-auto">
                Browse Cars
              </Button>
            </Link>
          </section>

          {/* Component Showcase (for development) */}
          {import.meta.env.DEV && (
            <section className="mt-12">
              <h3 className="text-xl font-semibold text-text-primary mb-6">
                Component Showcase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="hover">
                  <h4 className="font-semibold text-text-primary mb-2">Card with Hover</h4>
                  <p className="text-text-secondary text-sm">
                    This card has a hover effect
                  </p>
                </Card>
                <Card variant="clickable">
                  <h4 className="font-semibold text-text-primary mb-2">Clickable Card</h4>
                  <p className="text-text-secondary text-sm">
                    This card is clickable
                  </p>
                </Card>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

