import "antd/dist/antd.min.css";
import { Menu, Dropdown, Button } from "antd";
import {
  DownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  LeftOutlined,
  LockOutlined,
  MailOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
  SendOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PropertiesGridContainer from "../src/components/properties-grid-container";
import Footer from "../src/components/footer";

const PropertiesGridView = () => {
  return (
    <div className="relative bg-gray-white w-full flex flex-col items-start justify-start text-center text-33xl text-gray-white font-body-regular-400">
      <header className="self-stretch bg-gray-white h-[98px] flex flex-row py-[22px] px-20 box-border items-center justify-center sticky w-full top-[0] [background:white] z-[2] text-center text-5xl text-primary-500 font-body-regular-600 lg:pl-10 lg:pr-10 lg:box-border md:pl-6 md:pr-6 md:box-border">
        <div className="flex-1 flex flex-row items-center justify-between">
          <a className="[text-decoration:none] flex flex-row items-center justify-center gap-[8px] text-[inherit]">
            <img className="relative w-11 h-11" alt="" src="/houseline.svg" />
            <div className="flex flex-col items-start justify-start">
              <div className="relative leading-[24px] font-semibold">REIS</div>
              <div className="relative text-sm leading-[16px] font-medium">
                Real State
              </div>
            </div>
          </a>
          <div className="flex flex-row items-center justify-end gap-[36px] text-sm text-primary-900 sm:flex">
            <div className="flex flex-row items-start justify-start gap-[30px] lg:hidden">
              <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                HOME
              </a>
              <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                ABOUT US
              </a>
              <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                OUR AGENTS
              </a>
              <a className="[text-decoration:none] relative leading-[22px] font-semibold text-[inherit]">
                PROPERTIES
              </a>
              <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                GALLERY
              </a>
              <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                BLOG
              </a>
              <a className="[text-decoration:none] relative leading-[22px] text-[inherit]">
                CONTACT US
              </a>
              <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-sm leading-[22px] font-body-regular-600 text-primary-900 text-center inline-block">
                SEARCH
              </button>
            </div>
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] hidden flex-row items-center justify-center lg:flex">
              <img
                className="relative w-6 h-6 overflow-hidden shrink-0 md:flex"
                alt=""
                src="/notification.svg"
              />
            </button>
          </div>
        </div>
      </header>
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
              <img className="relative w-6 h-6" alt="" src="/listbullets.svg" />
              <img className="relative w-6 h-6" alt="" src="/squaresfour.svg" />
            </div>
            <div className="relative leading-[24px]">Sort by:</div>
            <Dropdown
              overlay={
                <Menu>
                  {[
                    { value: "Popular properties" },
                    { value: "Latest properties" },
                    { value: "Recommended properties" },
                  ].map((option, index) => (
                    <Menu.Item key={index}>
                      <a onClick={(e) => e.preventDefault()}>
                        {option.value || ""}
                      </a>
                    </Menu.Item>
                  ))}
                </Menu>
              }
              placement="bottomLeft"
              trigger={["hover"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                {`Default Order `}
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
        <PropertiesGridContainer />
        <div className="flex flex-row items-end justify-center gap-[8px]">
          <button className="cursor-pointer [border:none] p-2.5 bg-primary-50 rounded flex flex-row items-start justify-start">
            <img className="relative w-6 h-6" alt="" src="/arrowleft.svg" />
          </button>
          <button className="cursor-pointer [border:none] py-2.5 px-[9px] bg-primary-500 rounded-10xs flex flex-col items-start justify-start">
            <div className="relative text-base leading-[24px] font-semibold font-body-regular-600 text-gray-white text-center flex items-end justify-center w-[26px]">
              1
            </div>
          </button>
          <button className="cursor-pointer [border:none] py-2.5 px-[9px] bg-primary-50 rounded-10xs flex flex-col items-start justify-start">
            <div className="relative text-base leading-[24px] font-semibold font-body-regular-600 text-primary-500 text-center flex items-end justify-center w-[26px]">
              2
            </div>
          </button>
          <button className="cursor-pointer [border:none] py-2.5 px-[9px] bg-primary-50 rounded-10xs flex flex-col items-start justify-start">
            <div className="relative text-base leading-[24px] font-semibold font-body-regular-600 text-primary-500 text-center flex items-end justify-center w-[26px]">
              3
            </div>
          </button>
          <button className="cursor-pointer [border:none] py-2.5 px-[9px] bg-primary-50 rounded-10xs flex flex-col items-start justify-start">
            <div className="relative text-base leading-[24px] font-semibold font-body-regular-600 text-primary-500 text-center flex items-end justify-center w-[26px]">
              ...
            </div>
          </button>
          <button className="cursor-pointer [border:none] py-2.5 px-[9px] bg-primary-50 rounded-10xs flex flex-col items-start justify-start">
            <div className="relative text-base leading-[24px] font-semibold font-body-regular-600 text-primary-500 text-center flex items-end justify-center w-[26px]">
              54
            </div>
          </button>
          <button className="cursor-pointer [border:none] p-2.5 bg-primary-500 rounded flex flex-row items-start justify-start">
            <img className="relative w-6 h-6" alt="" src="/arrowright.svg" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertiesGridView;
