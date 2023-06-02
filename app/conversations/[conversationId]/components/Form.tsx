"use client"

import useConversation from "@/app/hooks/useConversation"
import axios from "axios"
import {CldUploadButton} from "next-cloudinary"
import {FieldValues, SubmitHandler, useForm} from "react-hook-form"
import {HiPhoto, HiPaperAirplane} from "react-icons/hi2"
import MessageInput from "./MessageInput"
interface FormProps {}

const Form: React.FC<FormProps> = (props) => {
  const {conversationId} = useConversation()

  const {
    register,
    handleSubmit,
    setValue,
    //解构出formState中的errors属性
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //消息发出后 清空输入框的值
    setValue("message", "", {shouldValidate: true})

    axios.post("/api/messages", {
      ...data,
      conversationId,
    })
  }

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId: conversationId,
    })
  }
  return (
    <div
      className="
        px-4
        py-4
        border-t
        flex
        item-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <CldUploadButton options={{maxFiles: 1}} onUpload={handleUpload} uploadPreset="ml_default">
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          flex 
          items-center 
          gap-2 
          lg:gap-4 
          w-full
        "
      >
        <MessageInput id="message" register={register} errors={errors} required placeholder="Write a message" />
        <button type="submit" className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition">
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  )
}

export default Form
