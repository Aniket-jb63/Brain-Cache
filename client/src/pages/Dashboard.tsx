import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MdOutlineContentCopy, MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { FaYoutube, FaTwitter, FaCheck } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRecoilState } from "recoil";
import { inputValueState, tagsState } from "@/store/atoms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const API_BASE = import.meta.env.VITE_API_BASE;

interface dataInterface {
  _id: string,
  title: string,
  link: string,
  tags: string[],
  createdAt: string,
}

function convertToEmbedUrl(youtubeUrl: string): string {
  try {
    const url = new URL(youtubeUrl);
    let videoId = '';

    if (url.hostname === 'youtu.be') {
      videoId = url.pathname.slice(1);
    } else if (url.hostname.includes('youtube.com')) {
      videoId = url.searchParams.get('v') || '';
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : youtubeUrl;
  } catch {
    return youtubeUrl;
  }
}

const Dashboard = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [data, setData] = useState<dataInterface[]>([])
  const [copied, setCopied] = useState(false)
  const [copyId, setCopyId] = useState("")
  const [inputValue, setInputValue] = useRecoilState(inputValueState);
  const [tags, setTags] = useRecoilState(tagsState);
  const [tagValue, setTagValue] = useState("")
  const copyHandler = (link: string, id: string) => {
    setCopyId(id)
    navigator.clipboard.writeText(link)
    setTimeout(() => {
      setCopied(false)
    }, 2000);
    setCopied(true)
  }
  const deleteContent = (id: string) => {
    if (!token) {
      return;
    }
    axios.delete(`${API_BASE}/content/${id}`, { headers: { token: JSON.parse(token) } })
      .then((res) => console.log(res))
      .catch((res) => console.log(res))
    window.location.reload();
  }
  const editValuesHandler = (id: string) => {
    if (!token) {
      return;
    }
    axios.get(`${API_BASE}/content/${id}`, { headers: { token: JSON.parse(token) } })
      .then((res) => {
        setInputValue({title:res.data.content.title,link:res.data.content.link,tags:[...res.data.content.tags]})
        setTags([...res.data.content.tags])
      })
      .catch((res) => console.log(res))
  }
  useEffect(() => {
    if (!token) {
      navigate('/')
      return;
    }
    axios.get(`${API_BASE}/content`, { headers: { token: JSON.parse(token) } })
      .then((res) => {
        console.log('Content data:', res.data.contents);
        setData([...res.data.contents])
      })
      .catch((res) => console.log(res))
  }, [token])

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };
  if (!token) {
    return
  }
  const submithandler = (id: string) => {
    console.log('Submitting with tags:', inputValue.tags);
    if (tagValue) {
      const newtags = [...tags, tagValue.trim()]
      setTags(newtags)
      setInputValue({ ...inputValue, tags: newtags })
      setTagValue("")
    }
    axios.put(`${API_BASE}/content/${id}`, { ...inputValue }, { headers: { token: JSON.parse(token) } })
      .then((res) => {
        console.log('Update successful:', res);
        setInputValue({ title: "", link: "", tags: [] })
        setTags([])
        // Fetch updated content instead of reloading
        axios.get(`${API_BASE}/content`, { headers: { token: JSON.parse(token) } })
          .then((res) => {
            setData([...res.data.contents])
          })
      })
      .catch((err) => {
        console.error('Update failed:', err)
      })
  }
  const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (tagValue) {
        const newtags = [...tags, tagValue.trim()]
        setTags(newtags)
        setInputValue({ ...inputValue, tags: newtags })
        setTagValue("")
      }
    }
  }
  const handleFilterTags = (e: string) => {
    const newtags = tags.filter((i) => i !== e)
    setTags(newtags)
    setInputValue({ ...inputValue, tags: newtags })
  }
  return (
    <div className="flex justify-start mt-5 lg:w-[80vw] md:w-[90vw] mb-5 m-auto flex-wrap">
      {
        data.map((e: dataInterface) => {
          const youtube = e.link.includes("youtube.com") || e.link.includes("youtu.be")
          const twitter = e.link.includes("twitter.com") || e.link.includes("x.com")
          const embedUrl = youtube ? convertToEmbedUrl(e.link) : e.link;

          return (
            <Card className="md:w-96 w-full h-[480px] overflow-auto m-3" key={e._id}>
              <CardHeader>
                <CardTitle className="flex justify-around items-center">
                  <div className="flex">
                    {
                      youtube && <FaYoutube className="text-2xl mr-4 cursor-pointer" />
                    }
                    {
                      twitter && <FaTwitter className="text-2xl mr-4 cursor-pointer" />
                    }
                    {
                      !youtube && !twitter && <HiOutlineDocument className="text-2xl mr-4 cursor-pointer" />
                    }
                  </div>
                  <p className="text-center p-1">{e.title}</p>
                  <div className="flex">
                    {copied && copyId == e._id ? <FaCheck className="text-2xl duration-500 ease-in-out" /> : <MdOutlineContentCopy className="text-2xl duration-500 ease-in-out cursor-pointer" onClick={() => copyHandler(e.link, e._id)} />}
                    <Dialog>
                      <DialogTrigger onClick={()=>editValuesHandler(e._id)}>
                        <MdOutlineEdit className="text-2xl ml-2 cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-3xl">Edit Content</DialogTitle>
                          <DialogDescription>
                            <Input placeholder="Title" type="text" className="my-4" value={inputValue.title} onChange={(e) => setInputValue({ ...inputValue, title: e.target.value })} />
                            <Input placeholder="Link" type="text" value={inputValue.link} onChange={(e) => setInputValue({ ...inputValue, link: e.target.value })} />
                            <div className="h-[300px] border my-4 overflow-x-hidden sm:w-[470px] overflow-y-scroll">
                              {tags.map((e, i) => {
                                return (
                                  <Badge className="m-2" key={e + i}>{e} <span className="text-accent text-lg" onClick={() => handleFilterTags(e)}>x</span> </Badge>
                                )
                              })}
                            </div>
                            <Input placeholder="tags" type="text" value={tagValue} onKeyDown={handleTags} onChange={(e) => { setTagValue(e.target.value) }} />
                            <Button className="mt-2 cursor-pointer rounded-sm" onClick={() => submithandler(e._id)} disabled={!inputValue.title || !inputValue.link}>Update Link</Button>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <MdOutlineDelete className="text-2xl ml-2 cursor-pointer" onClick={() => deleteContent(e._id)} />
                  </div>
                </CardTitle>
                {
                  twitter && (
                    <div className="rounded-lg px-2">
                      <blockquote className="twitter-tweet" data-dnt="true">
                        <a href={e.link.replace("x.com", "twitter.com")}></a>
                      </blockquote>
                    </div>
                  )
                }
                {
                  youtube && (
                    <div className="rounded-lg">
                      <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="px-5 pb-2 rounded-lg mt-5"
                      />
                    </div>
                  )
                }
                {
                  !youtube && !twitter && (
                    <>
                      <a href={e.link} className="mx-4 inline-block my-2 underline text-primary" target="_blank">
                        Your Link
                      </a>
                      <div className="w-full h-[250px] flex items-center justify-center bg-muted">
                        <span className="ml-2 text-muted-foreground">
                          Click above to view document
                        </span>
                      </div>
                    </>
                  )
                }
              </CardHeader>
              <CardContent>
                {e.tags && e.tags.length > 0 ? (
                  e.tags.map((tag) => (
                    <Badge className="m-2" key={`${e._id}-${tag}`}>#{tag}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No tags</span>
              )}
              </CardContent>
              <CardFooter>
                <p>Added on {formatDate(e.createdAt)}</p>
              </CardFooter>

            </Card>
          )
        })
      }
      {
        !data.length && <h1 className="flex justify-center items-center w-screen h-[80vh] text-6xl">No Content</h1>
      }
    </div>
  )
}

export default Dashboard