import HeroContainer from "@/components/hero-container";
import AreasContainer from "@/components/areas-container";
import FeatureContainer from "@/components/feature-container";
import RentPropertiesContainer from "@/components/rent-properties-container";
import PropertiesOfRentCard from "@/components/properties-of-rent-card";
import ContactForm from "@/components/contact-form";

const LandingPage = () => {
  return (
    <div className="relative bg-gray-white w-full flex flex-col items-center justify-start">
      <HeroContainer />
      <AreasContainer />
      <FeatureContainer />
      <RentPropertiesContainer />
      <PropertiesOfRentCard />
      <ContactForm />
    </div>
  );
};

export default LandingPage;
