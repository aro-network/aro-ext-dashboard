import { FC, useState } from "react"
import ACartoonImage from "./ACartoonImage"
import { ConfirmDialog } from "./dialogimpls"
import { Skeleton } from "@nextui-org/react"

export type singleCartoon = {
  hat: number | null,
  head: number | null,
  eyes: number | null,
  clothes: number | null,
  hand: null | [number, number],
  pants: number | null,
  shoes: number | null,
  logo: number | null,
}

export type cartoonType = {
  one?: singleCartoon
  two?: singleCartoon
  name?: string
}

type commonCartoontype = {
  cartoonList: cartoonType[]
  loading?: boolean

}
const ACommonCartoonList: FC<commonCartoontype> = ({ cartoonList, loading }) => {
  const [userClickedCartoon, setUserClickedCartoon] = useState<{ value?: cartoonType, isOpen: boolean }>({ value: undefined, isOpen: false })


  const onShowOne = (item: cartoonType) => {
    setUserClickedCartoon({ value: item, isOpen: true })
  }

  return <div className="grid grid-cols-3 smd:grid-cols-1  xsl:grid-cols-2 w-full gap-10">
    {cartoonList.map((item, index) => {
      return <Skeleton key={`cartoon_${index}`} isLoaded={!loading} className=" border border-[#7e7e7e] rounded-3xl !bg-[#7E7E7E] ">
        <button className="   flex-wrap flex-col items-center justify-center rounded-3xl  !bg-[#7E7E7E] gap-5 flex  w-full " onClick={() => onShowOne(item)} >
          <span className="text-xl pt-5">{item.name}</span>
          <div className="flex gap-5 smd:flex-wrap smd:flex-col smd:items-center smd:justify-center">
            {item.one && <ACartoonImage data={item.one} />}
            {item.two && <ACartoonImage data={item.two} />}
          </div>
        </button>

      </Skeleton>
    })}



    {userClickedCartoon.isOpen &&
      <ConfirmDialog
        tit=""
        msg={
          <div className="w-full flex justify-center items-center gap-5 flex-col px-5">
            <span className="text-xl">{userClickedCartoon.value?.name}</span>
            <div className="flex gap-5">
              {userClickedCartoon.value?.one && <ACartoonImage data={userClickedCartoon.value?.one} />}
              {userClickedCartoon.value?.two && <ACartoonImage data={userClickedCartoon.value?.two} />}
            </div>

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