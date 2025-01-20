import { FC, useState } from "react"
import ACartoonImage from "./ACartoonImage"
import { ConfirmDialog } from "./dialogimpls"

export type singleCartoon = {
  hat: number,
  head: number,
  eyes: number,
  clothes: number,
  hand: [number, number],
  pants: number,
  shoes: number,
  logo: number
}

export type cartoonType = {
  one: singleCartoon
  two?: singleCartoon
}

type commonCartoontype = {
  cartoonList: cartoonType[]

}
const ACommonCartoonList: FC<commonCartoontype> = ({ cartoonList }) => {
  const [userClickedCartoon, setUserClickedCartoon] = useState<{ value?: cartoonType, isOpen: boolean }>({ value: undefined, isOpen: false })


  const onShowOne = (item: cartoonType) => {
    setUserClickedCartoon({ value: item, isOpen: true })
  }
  return <div className="grid grid-cols-3 smd:grid-cols-1  xsl:grid-cols-2 w-full gap-10">
    {cartoonList.map((item, index) => {
      return <div key={`cartoon_${index}`} onClick={() => onShowOne(item)} className="pt-10 border rounded-3xl flex-wrap  bg-fuchsia-300  justify-center gap-5 flex  w-full  border-black">
        {item.one && <ACartoonImage data={item.one} />}
        {item.two && <ACartoonImage data={item.two} />}
      </div>
    })}


    {userClickedCartoon.isOpen &&
      <ConfirmDialog
        tit=""
        msg={
          <div className="w-full flex justify-center items-center gap-5">
            {userClickedCartoon.value?.one && <ACartoonImage data={userClickedCartoon.value?.one} />}
            {userClickedCartoon.value?.two && <ACartoonImage data={userClickedCartoon.value?.two} />}

          </div>
        }
        className=" p-[1rem]"
        confirmText={null}
        cancelColor='default'
        cancelText={
          null
        }
        isOpen={userClickedCartoon.isOpen}
        onCancel={() => setUserClickedCartoon({ value: undefined, isOpen: false })}
      />

    }
  </div>
}

export default ACommonCartoonList