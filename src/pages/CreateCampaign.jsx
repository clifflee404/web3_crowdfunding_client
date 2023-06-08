import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"

import { money } from "../assets"
import { CustomButton, FormField, Loader } from "../components"
import { checkIfImage } from "../utils"
import { useStateContext } from "../context"

const CreateCampaign = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { createCampaign } = useStateContext()
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  })

  const handleFormFieldChange = (fieldName, e) => {
    setForm({
      ...form,
      [fieldName]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true)
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        })
        setIsLoading(false)
        navigate("/")
      } else {
        alert("Provide valid image URL")
        setForm({ ...form, image: "" })
      }
    })
    console.log(form)
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader tips="交易正在进行"/>}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          发起一个项目
        </h1>
      </div>

      <form
        className="w-full mt-[65px] flex flex-col gap-[30px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="昵称 *"
            placeholder="请输入你的昵称"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            labelName="项目标题 *"
            placeholder="请输入项目标题"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>
        <FormField
          labelName="项目介绍 *"
          placeholder="请输入项目相关介绍"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
          您将获得筹集金额的 100%
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="目标金额 *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            labelName="截止时间 *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>

        <FormField
          labelName="项目封面图 *"
          placeholder="请输入有效的项目封面图链接"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="提交项目"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign
