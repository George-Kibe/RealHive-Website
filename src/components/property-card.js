import Image from "next/image";

const PropertyCard = ({ title, image, price, area}) => {
  const car="/car.svg"
  const bathtub="/bathtub.svg"
  const arrowsOut="/arrowsout.svg"
  const ellipse1="/ellipse-1@2x.png"
  const shareNetwork="/sharenetwork.svg"
  const heart="/heart.svg"
  const plus="/plus.svg"
  return (
    <div
      className="rounded-3xs bg-gray-white box-border w-[350px] h-[466.99px] flex flex-col py-[15px] px-[13px] items-start justify-start gap-[23px] text-left text-[14.51px] text-gray-700 font-body-regular-600 border-[1px] border-solid border-whitesmoke-100 hover:bg-gainsboro hover:cursor-pointer sm:w-[100%!important] sm:mb-5"
    >
      <a className= {`[text-decoration:none] self-stretch relative rounded-3xs h-[200px] bg-cover bg-no-repeat bg-[top]`}>
        <Image src={image} fill className="flex rounded-md" />
      </a>
      
      <div className="self-stretch flex flex-row p-2.5 items-start justify-start">
        <div className="flex-1 relative leading-[20.32px] font-medium">
          {title}
        </div>
      </div>
      <div className="self-stretch flex flex-row p-2.5 items-start justify-start text-[13.55px] text-primary-500">
        <div className="relative leading-[18.98px] font-semibold">
          Kshs. {price}
        </div>
      </div>
      <div className="self-stretch flex flex-row py-0 px-2.5 items-start justify-start gap-[17px] text-[10.84px] text-gray-500">
        <div className="flex flex-row items-center justify-start gap-[4.35px]">
          <img className="relative w-[17.42px] h-[17.42px]" alt="" src={car} />
          <div className="relative leading-[16.27px] font-medium">4</div>
        </div>
        <div className="flex flex-row items-center justify-start gap-[4.35px]">
          <img
            className="relative w-[17.42px] h-[17.42px]"
            alt=""
            src={bathtub}
          />
          <div className="relative leading-[16.27px] font-medium">4</div>
        </div>
        <div className="flex flex-row items-center justify-start gap-[4.35px]">
          <img
            className="relative w-[17.42px] h-[17.42px]"
            alt=""
            src={arrowsOut}
          />
          <div className="relative leading-[16.27px] font-medium">
            {area || Math.floor(Math.random() * 10000)} ft
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-row items-center justify-between text-center text-[11.61px]">
        <div className="flex flex-row items-center justify-start gap-[5.81px]">
          <img
            className="relative rounded-[50%] w-[27.57px] h-[27.57px] object-cover"
            alt=""
            src={image}
          />
          <div className="relative leading-[17.42px] font-medium">
            Jenny Wilson
          </div>
        </div>
        <div className="flex flex-row items-start justify-start gap-[8.71px]">
          <div className="rounded-[1.45px] bg-primary-50 flex flex-row p-[2.902620315551758px] items-start justify-start">
            <img
              className="relative w-[14.51px] h-[14.51px]"
              alt=""
              src={shareNetwork}
            />
          </div>
          <div className="rounded-[1.45px] bg-primary-50 flex flex-row p-[2.902620315551758px] items-start justify-start">
            <img
              className="relative w-[14.51px] h-[14.51px]"
              alt=""
              src={heart}
            />
          </div>
          <div className="rounded-[1.45px] bg-primary-50 flex flex-row p-[2.902620315551758px] items-start justify-start">
            <img
              className="relative w-[14.51px] h-[14.51px]"
              alt=""
              src={plus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
