import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LuBrain, LuLayoutGrid } from "react-icons/lu";
import { FaYoutube,FaTwitter } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"
import { HiOutlineDocument } from "react-icons/hi";

const SharedSidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const onclickhandler1 = () => {
    navigate(`/share/${id}/videos`);
  }
  const onclickhandler2 = () => {
    navigate(`/share/${id}/tweets`);
  }
  const onclickhandler3 = () => {
    navigate(`/share/${id}/documents`);
  }
  const showAll = () => {
    navigate(`/share/${id}`);
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Menu/>
        </SheetTrigger>
        <SheetContent side="left">
          <h1 className="flex items-center text-3xl py-10 mx-1"><LuBrain className="text-[50px] mx-2"/>Brainly</h1>
          <h1 onClick={showAll} className="flex hover:bg-accent py-2 cursor-pointer"><LuLayoutGrid className=" mx-5 text-3xl"/>Dashboard</h1>
          <h1 onClick={onclickhandler1} className="flex hover:bg-accent py-2 cursor-pointer"><FaYoutube className=" mx-5 text-3xl"/>Videos</h1>
          <h1 onClick={onclickhandler2} className="flex hover:bg-accent py-2 cursor-pointer"><FaTwitter className=" mx-5 text-3xl"/>Tweets</h1>
          <h1 onClick={onclickhandler3} className="flex hover:bg-accent py-2 cursor-pointer"><HiOutlineDocument className=" mx-5 text-3xl"/>Documents</h1>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SharedSidebar