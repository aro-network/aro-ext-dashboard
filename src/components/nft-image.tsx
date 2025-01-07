
export type TraitConfig = {
    
}
export type CollectonConfig = {
    [k: string]: TraitConfig[]
}

const defConfig: CollectonConfig = {

}
export function NFTImage({}: {config?: CollectonConfig, data: string}) {
    return <svg width="1em" height="1em" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">

    </svg>
}