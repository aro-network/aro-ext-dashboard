import { FC, Fragment, useEffect, useRef, useState } from "react"
import ACartoonImage from "./ACartoonImage"
import { ConfirmDialog } from "./dialogimpls"
import { Skeleton } from "@nextui-org/react"
import { TapItem } from "./aibum"
import { convertToNew } from "@/lib/utils"
import { useInfiniteQuery } from "@tanstack/react-query"
import backendApi from "@/lib/api"
import { useAuthContext } from "@/app/context/AuthContext"
import { useSearchParams } from "next/navigation"
import { useIntersection } from "react-use"

type commonCartoontype = {
  showEmpty?: boolean
  loadType: 'uid' | 'auth'
}
const ACommonCartoonList: FC<commonCartoontype> = ({ showEmpty, loadType }) => {
  const ac = useAuthContext()
  const sp = useSearchParams()
  const uid = sp.get('uid')
  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ['queryCartoonListByUid', loadType, loadType == 'auth' ? ac.user : uid],
    enabled: loadType == 'auth' ? Boolean(ac.user) : Boolean(uid),
    queryFn: async ({ pageParam: pageNum }) => {
      const pageSize = 10
      const pageParams = { pageSize, pageNum }
      const data = await (loadType == 'auth' ? backendApi.getCartoonList(pageParams) : backendApi.getAlbumItemList(uid!, pageParams))
      return { data: data.list, next: data.list.length < 10 ? null : pageNum + 1 }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next
  })
  const ref = useRef(null)
  const intersection = useIntersection(ref, { root: null, })
  const inView = intersection && intersection.intersectionRatio >= 1
  useEffect(() => { if (inView && !isFetching) fetchNextPage() }, [inView, isFetching])

  const [userClickedCartoon, setUserClickedCartoon] = useState<{ value?: TapItem, isOpen: boolean }>({ value: undefined, isOpen: false })
  const onShowOne = (item: TapItem) => {
    setUserClickedCartoon({ value: item, isOpen: true })
  }
  const pages = data?.pages || []
  const isEmpty = !pages || pages.length == 0 || pages[0].data.length == 0
  return <div className="w-full">
    {(isEmpty) && !isFetching && showEmpty && <div className=" text-xl w-full text-center flex justify-center ">Oops! Nothing here yet.</div>}
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18.75rem,1fr))] w-full gap-5">
      {
        pages.map(({ data }, pi) => <Fragment key={`page_${pi}`}>
          {
            data.map((item, index) => {
              return <div key={`cartoon_${pi}_${index}`} className="flex-wrap flex-col items-center justify-center gap-5 flex  w-full  bg-[#7E7E7E] cursor-pointer rounded-3xl" onClick={() => onShowOne(item)} >
                {/* <span className="text-xl pt-5">{item.content}</span> */}
                <div className="flex gap-5 flex-nowrap pt-5">
                  {item.tapFromUserId && <ACartoonImage data={convertToNew(item.tapFromUserId)} size={100} />}
                  {item.tapToUserId && <ACartoonImage data={convertToNew(item.tapToUserId)} size={100} />}
                </div>
              </div>
            })
          }
        </Fragment>)
      }
      {
        isFetching && <>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
        </>
      }
      {
        userClickedCartoon.isOpen &&
        <ConfirmDialog
          tit=""
          msg={
            <div className="w-full flex justify-center items-center gap-5 flex-col px-5">
              {/* <span className="text-xl">{userClickedCartoon.value?.content}</span> */}
              <span className="text-xl">Your blueberry accidentally interrupted a choir practice. Instead of leaving, it joined in, humming off-key. The choir director laughed, saying, ‘At least you’ve got spirit!’</span>
              <div className="flex gap-5 flex-nowrap">
                {userClickedCartoon.value?.tapFromUserId && <ACartoonImage data={convertToNew(userClickedCartoon.value?.tapFromUserId)} />}
                {userClickedCartoon.value?.tapToUserId && <ACartoonImage data={convertToNew(userClickedCartoon.value?.tapToUserId)} />}
              </div>

            </div>
          }
          className=" p-[1rem] w-[37.5rem] max-w-2xl"
          confirmText={null}
          cancelColor='default'
          cancelText={
            null
          }
          isOpen={userClickedCartoon.isOpen}
          onCancel={() => setUserClickedCartoon({ value: undefined, isOpen: false })}
        />
      }
    </div >
    <div ref={ref} className="h-1 opacity-0" />
  </div>
}

export default ACommonCartoonList