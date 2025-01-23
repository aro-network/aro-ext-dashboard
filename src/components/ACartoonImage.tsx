import { singleCartoon } from "./ACommonCartoonList";
const ASSET_PATH = "/svg";

interface ACartoonImageProps {
  data: singleCartoon;
}

const getSvgPath = (
  type: "hand" | "shoes" | "pants" | "clothes" | "logo" | "eyes" | "head" | "hat",
  index: number | null = 0,
  otherSvgPath?: string
) => `${ASSET_PATH}/${type}/${otherSvgPath || type}${index}.svg`;

const ACartoonImage: React.FC<ACartoonImageProps> = ({ data }) => {


  return (
    <div>
      <div>
        <svg
          id="cartoon"
          width="200"
          height="450"
          xmlns="http://www.w3.org/2000/svg"
        >
          <foreignObject x="0" y="0" width="260" height="450">
            <div className="relative m-auto flex items-center justify-center">
              <img
                src={getSvgPath("shoes", data?.shoes)}
                alt="shoes"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 6, top: "365px", zIndex: 0, width: "180px" }}
              />
              <img
                src={getSvgPath("pants", data.pants)}
                alt="pants"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: "40px", top: "315px", zIndex: 1 }}
              />
              <img
                src={getSvgPath("hand", data.hand && data.hand[0], "leftHand")}
                alt="leftHand"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 3, top: "305px", width: "24px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("hand", data.hand && data.hand[1], "rightHand")}
                alt="rightHand"
                crossOrigin="anonymous"
                style={{ position: "absolute", right: 70, top: "305px", width: "24px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("clothes", data.clothes)}
                alt="clothes"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 15, top: "225px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("logo", data.logo)}
                alt="logo"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 85, top: "275px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("eyes", data.eyes)}
                alt="eyes"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: "25px", top: "120px", width: "150px", zIndex: 10000 }}
              />
              <img
                src={getSvgPath("head", data.head)}
                alt="head"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 0, top: "50px", width: "200px", zIndex: 4 }}
              />
              <img
                src={getSvgPath("hat", data.hat)}
                alt="hat"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 0, top: 0, width: "200px", zIndex: 5 }}
              />
            </div>
          </foreignObject>
        </svg>

      </div>




    </div>
  );
};

export default ACartoonImage;
