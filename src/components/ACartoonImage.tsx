import { singleCartoon } from "./ACommonCartoonList";

const ASSET_PATH = "/svg";


const getSvgPath = (type: "hand" | "shoes" | "pants" | "clothes" | "logo" | "eyes" | "head" | "hat", index: number, otherSvgPath?: string) => `${ASSET_PATH}/${type}/${otherSvgPath || type}${index}.svg`;

const ACartoonImage = ({ data }) => {

  return (
    <svg
      width="200"
      height="450"
      xmlns="http://www.w3.org/2000/svg"
    >

      <foreignObject x="0" y="0" width="260" height="450">
        <div className="relative  m-auto flex items-center justify-center">
          <img
            src={getSvgPath("shoes", data.shoes)}
            alt="shoes"
            style={{
              position: "absolute",
              left: 6,
              top: "365px",
              zIndex: 0,
              width: '180px'
            }}
          />
          <img
            src={getSvgPath("pants", data.pants)}
            alt="pants"
            style={{
              position: "absolute",
              left: "40px",
              top: "315px",
              zIndex: 1,
            }}
          />
          <img
            src={getSvgPath("hand", data.hand[0], 'leftHand')}
            alt="leftHand"
            style={{
              position: "absolute",
              left: 3,
              top: "305px",
              width: "24px",
              zIndex: 2,
            }}
          />
          <img
            src={getSvgPath("hand", data.hand[1], 'rightHand')}
            alt="righttHand"
            style={{
              position: "absolute",
              right: 70,
              top: "305px",
              width: "24px",
              zIndex: 2,
            }}
          />
          <img
            src={getSvgPath("clothes", data.clothes)}
            alt="clothes"
            style={{
              position: "absolute",
              left: 15,
              top: "225px",
              zIndex: 2,
            }}
          />
          <img
            src={getSvgPath("logo", data.logo)}
            alt="logo"
            style={{
              position: "absolute",
              left: 85,
              top: "275px",
              zIndex: 2,
            }}
          />
          <img
            src={getSvgPath("eyes", data.eyes)}
            alt="eyes"
            style={{
              position: "absolute",
              left: "25px",
              top: "120px",
              width: "150px",
              zIndex: 10000,
            }}
          />
          <img
            src={getSvgPath("head", data.head)}
            alt="head"
            style={{
              position: "absolute",
              left: 0,
              top: "50px",
              width: "200px",
              zIndex: 4,
            }}
          />
          <img
            src={getSvgPath("hat", data.hat)}
            alt="hat"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "200px",
              zIndex: 5,
            }}
          />
        </div>
      </foreignObject>



    </svg>
  );
};

export default ACartoonImage;
