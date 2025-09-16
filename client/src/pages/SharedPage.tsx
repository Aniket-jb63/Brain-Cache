import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaYoutube,FaTwitter, FaCheck } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NoPage from "./NoPage";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import SharedSidebar from "./SharedSidebar";
const API_BASE = import.meta.env.VITE_API_BASE;

interface dataInterface{
  _id:string,
  title:string,
  link:string,
  tags:string[],
  createdAt:string,
}

const SharedPage = () => {
  const copyHandler=(link:string,id:string)=>{
    setCopyId(id)
    navigator.clipboard.writeText(link)
    setTimeout(() => {
      setCopied(false)
    }, 2000);
    setCopied(true)
  }
  const [data, setData] = useState<dataInterface[]>([])
  const [copied, setCopied] = useState(false)
  const [copyId, setCopyId] = useState("")
  const [loading, setLoading] = useState(true)
  const { id, type } = useParams()
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const [user, setUser] = useState<{ username?: string; email?: string; posts?: string }>({})
    useEffect(() => {
        if (!token) {
            navigate('/')
            return;
        }
        axios.get(`${API_BASE}/user`, { headers: { token: JSON.parse(token) } })
            .then((e) => { setUser(e.data) })
            .catch((res) => console.log(res))
    }, [])

  useEffect(() => {
    setLoading(true);
    // First fetch all data for the share ID
    axios.get(`${API_BASE}/share/${id}`)
      .then((res) => {
        const contents = res.data.contents || [];
        const responseData = Array.isArray(contents) ? contents : [contents];
        let validData = responseData.filter((item): item is dataInterface => {
          return item && item.link && typeof item.link === 'string';
        });

        if (type) {
          validData = validData.filter((item) => {
            switch (type) {
              case 'videos':
                return item.link.includes('youtube.com');
              case 'tweets':
                return item.link.includes('twitter.com') || item.link.includes('x.com');
              case 'documents':
                return !item.link.includes('youtube.com') &&
                       !item.link.includes('twitter.com') &&
                       !item.link.includes('x.com');
              default:
                return true;
            }
          });
        }

        setData(validData);
      })
      .catch((error) => {
        console.error('Error fetching shared data:', error.response?.data?.error || error.message);
        setData([]);

        if (error.response?.status === 404) {
            toast.error(error.response.data.error || 'Share not found');
        } else {
            toast.error('Failed to load shared content');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, type]);

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB")
  }
  if (loading) return <div>Loading...</div>
  if (!data.length) return <NoPage />

  return (
    <div className="px-10">
      <div className="text-2xl px-140 mt-5 font-semibold">
        Here is Brain of User - {user.username}
        <br />
        No of Posts - {user.posts}
      </div>
      <SharedSidebar />

        <div className="flex justify-center lg:justify-start mt-5 lg:w-[80vw] md:w-[90vw] mb-5 m-auto flex-wrap">
          {
            data.map((e:dataInterface)=>{
              if (!e?.link) return null; // Skip invalid items

              const youtube=e.link.includes("youtube.com")
              const twitter=e.link.includes("twitter.com") || e.link.includes("x.com")
              function convertToEmbedUrl(youtubeUrl: string){
                const urlPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
                const match = youtubeUrl.match(urlPattern);
                if (match && match[1]) {
                  return `https://www.youtube.com/embed/${match[1]}?si=O8eFX0as4ErK1yu7`;
                }

              }
              const nlink=convertToEmbedUrl(e.link)
              return(
                <Card className=" w-96 h-[480px] overflow-auto m-3" key={e._id}>
                  <CardHeader>
                    <CardTitle className="flex justify-around items-center">
                      <div className="flex">
                        {
                          youtube&&<FaYoutube className="text-2xl mr-4 cursor-pointer"/>
                        }
                        {
                          twitter&&<FaTwitter  className="text-2xl mr-4 cursor-pointer"/>
                        }
                        {
                          !youtube&&!twitter&&<HiOutlineDocument  className="text-2xl mr-4 cursor-pointer"/>
                        }
                      </div>
                      <p className=" text-center p-1">{e.title}</p>
                      <div className="flex">
                        {copied&&copyId==e._id?<FaCheck className="text-2xl duration-500 ease-in-out"/>:<MdOutlineContentCopy className="text-2xl duration-500 ease-in-out cursor-pointer" onClick={()=>copyHandler(e.link,e._id)}/>}
                      </div>
                      </CardTitle>
                    {
                        twitter&&<div className=" rounded-lg px-2">
                        <blockquote className="twitter-tweet">
                            <a href={e.link.replace("x.com","twitter.com")}></a>
                            </blockquote>
                        </div>
                    }
                    {
                        youtube&&<div className=" rounded-lg">
                    <iframe className=" w-full h-60 px-5 pb-2 rounded-lg mt-5" width="560" height="315" src={(nlink)} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>
                    }
                    {
                  !youtube && !twitter && (
                    <>
                      <a href="http://localhost:5173/retremvmk" className="mx-4 inline-block my-2 underline text-primary" target="_blank">
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
                    {
                      e.tags.map((i)=>{
                        return(
                          <Badge className="m-2" key={e._id+i}>#{i}</Badge>
                        )
                      })
                    }
                  </CardContent>
                  <CardFooter>
                    <p>Added on {formatDate(e.createdAt)}</p>
                  </CardFooter>
                </Card>
                )
                })
                }
        </div>
      </div>
  )
}

export default SharedPage
