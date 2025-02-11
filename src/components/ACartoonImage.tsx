import _ from "lodash";
import { useMemo } from "react";

export type singleCartoon = {
  hat: number,
  head: number,
  eyes: number,
  clothes: number,
  leftHand: number,
  rightHand: number,
  pants: number,
  shoes: number,
  logo: number,
}
interface ACartoonImageProps {
  data: singleCartoon | string; // 
  size?: number
}

const Types = [{ type: "shoes", count: 4 }, { type: "pants", count: 4 }, { type: 'leftHand', count: 4 }, { type: 'rightHand', count: 4 }, { type: "clothes", count: 5 }, { type: "logo", count: 4 }, { type: "eyes", count: 4 }, { type: "head", count: 4 }, { type: "hat", count: 4 }] as const
const getSvgPath = (
  type: (typeof Types)[number]['type'],
  index: number | null = 0,
) => `/svg/${type}/${type}${index}.svg`;

const toIndex = (data: string, index: number, mod: number) => {
  try {
    const num = parseInt(data.slice(Math.round((index * 2)), Math.round(index * 2 + 2)))
    if (Number.isSafeInteger(num)) return num % mod
    return 0
  } catch (error) {
    return 0
  }
}
const ACartoonImage: React.FC<ACartoonImageProps> = ({ data, size = 200 }) => {
  const mdata = useMemo(() => {
    if (typeof data == 'string') {
      const sc = {} as singleCartoon
      Types.forEach((item, index) => {
        sc[item.type] = toIndex(data, index, item.count)
      })
      return sc
    }
    return data
  }, [data])
  const widthRem = _.round(size / 16, 3)
  const heightRem = _.round(widthRem * 2.25, 3)

  return (
    <div>
      <div>
        <svg
          id="cartoon"
          width={widthRem + 'rem'}
          height={heightRem + 'rem'}
          viewBox="0 0 200 450"
          xmlns="http://www.w3.org/2000/svg"
        >
          <foreignObject x="0" y="0" width="200" height="450">
            <div className="relative m-auto flex items-center justify-center">
              <img
                src={getSvgPath("shoes", mdata.shoes)}
                alt="shoes"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 6, top: "365px", zIndex: 0, width: "180px" }}
              />
              <img
                src={getSvgPath("pants", mdata.pants)}
                alt="pants"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: "40px", top: "315px", zIndex: 1 }}
              />
              <img
                src={getSvgPath("leftHand", mdata.leftHand)}
                alt="leftHand"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 3, top: "305px", width: "24px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("rightHand", mdata.rightHand)}
                alt="rightHand"
                crossOrigin="anonymous"
                style={{ position: "absolute", right: 10, top: "305px", width: "24px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("clothes", mdata.clothes)}
                alt="clothes"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 15, top: "225px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("logo", mdata.logo)}
                alt="logo"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 85, top: "275px", zIndex: 2 }}
              />
              <img
                src={getSvgPath("eyes", mdata.eyes)}
                alt="eyes"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: "25px", top: "120px", width: "150px", zIndex: 10000 }}
              />
              <img
                src={getSvgPath("head", mdata.head)}
                alt="head"
                crossOrigin="anonymous"
                style={{ position: "absolute", left: 0, top: "50px", width: "200px", zIndex: 4 }}
              />
              <img
                src={getSvgPath("hat", mdata.hat)}
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
