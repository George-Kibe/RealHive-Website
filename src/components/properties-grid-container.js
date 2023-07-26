
import PropertyCard from "./property-card";

const PropertiesGridContainer = ({properties}) => {
  return (
    <div className="self-stretch flex flex-row flex-wrap items-start justify-center text-left text-[14.51px] text-gray-700 font-body-regular-600">
      <div className="flex-1 flex flex-row flex-wrap items-start justify-center gap-[8px]">
        {
          properties.map((property, index) => (
            <PropertyCard
              key={property._id}
              title={property.title}
              image={property.image || property.images[Math.floor(Math.random() * property.images.length) + 1]}
              price={property.newPrice}
              area={property.area}
            />
          ))
        }        
      </div>
    </div>
  );
};

export default PropertiesGridContainer;
