import { atom } from "recoil";
interface inputs{
  title: string,
  link: string,
  tags: string[]
}

export const inputValueState = atom({
  key: 'inputValue',
  default: {
    title:"",
    link:"",
    tags:[]
  } as inputs
})

export const tagsState = atom({
  key: 'tags',
  default: [] as string[],
})