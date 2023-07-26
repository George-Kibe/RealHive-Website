import { Pagination } from "antd";
import PropertiesGridContainer from "@/components/properties-grid-container";
import Property from "@/models/Property";
import connect from "@/utils/db";
import { DropDown } from "@/components/DropDown";
import getAllProperties from "@/utils/getAllProperties";

async function getMongoProperties() {
  await connect()
  const response = await Property.find({}, null, {sort: {"_id": -1}})
  const productsData = JSON.parse(JSON.stringify(response))
  return productsData
}

const PropertiesGridView = async() => {
  const mongoProperties = await getMongoProperties();
  const allProperties = await getAllProperties()

  // console.log("All properties: ", allProperties)
  return (
    <div className="relative bg-gray-white w-full flex flex-col items-start justify-start text-center text-33xl text-gray-white font-body-regular-400">
      <div className="self-stretch h-60 flex flex-col items-center justify-center bg-[url(/category@3x.png)] bg-cover bg-no-repeat bg-[top]">
        <div className="flex flex-col items-center justify-start gap-[12px]">
          <div className="relative leading-[72px] font-semibold">
            Properties
          </div>
          <a className="[text-decoration:none] relative text-base leading-[24px] text-whitesmoke-200 font-body-regular-600">
            <span>{`Home / `}</span>
            <span className="font-medium text-gray-white">Properties</span>
          </a>
        </div>
      </div>
      <div className="self-stretch flex flex-col pt-16 px-0 pb-2 items-center justify-start gap-[95px] text-left text-base text-gray-black font-body-regular-600 lg:pl-[120px] lg:pr-[120px] lg:box-border md:pl-[60px] md:pr-[60px] md:box-border sm:pl-5 sm:pr-5 sm:box-border">
        <div className="w-[272px] flex flex-row items-center justify-start">
          <div className="flex flex-row items-end justify-start gap-[16px]">
            <div className="flex flex-row items-start justify-start gap-[8px]">
              <img className="relative w-6 h-6" alt="list-image" src="/listbullets.svg" />
              <img className="relative w-6 h-6" alt="four-squares-image" src="/squaresfour.svg" />
            </div>
            <div className="relative leading-[24px]">Sort by:</div>
            <DropDown />
          </div>
        </div>
        <PropertiesGridContainer properties={allProperties.length > 1 ? allProperties : mongoProperties} />
        <div className="flex flex-row items-end justify-center gap-[8px]">
         <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
    </div>
  );
};

export default PropertiesGridView;
