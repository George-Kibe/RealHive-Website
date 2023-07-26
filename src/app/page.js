import HeroContainer from "@/components/hero-container";
import AreasContainer from "@/components/areas-container";
import FeatureContainer from "@/components/feature-container";
import RentPropertiesContainer from "@/components/rent-properties-container";
import PropertiesOfRentCard from "@/components/properties-of-rent-card";
import ContactForm from "@/components/contact-form";
import Property from "@/models/Property";
import connect from "@/utils/db";
import getAllProperties from "@/utils/getAllProperties";

async function getFeaturedProductDetails(id) {
  await connect()
  // const ids = req.body.ids;
  // res.json(await Product.find({_id:ids}));
  const response = await Property.findById(id);
  const productData = JSON.parse(JSON.stringify(response))
  return productData
}

async function getLatestProperties() {
  await connect()
  const response = await Property.find({}, null, {sort: {"_id": -1}, limit:10})
  const productsData = JSON.parse(JSON.stringify(response))
  return productsData
}

const HomePage = async() => {
  const properties = await getLatestProperties();
  const allProperties = await getAllProperties()
  // console.log("Properties: ", allProperties)
  return (
    <div className="relative bg-gray-white w-full flex flex-col items-center justify-start">
      <HeroContainer />
      <AreasContainer />
      <FeatureContainer />
      <RentPropertiesContainer properties={allProperties.slice(0,10)} />
      <PropertiesOfRentCard />
      <ContactForm />
    </div>
  );
};

export default HomePage;
