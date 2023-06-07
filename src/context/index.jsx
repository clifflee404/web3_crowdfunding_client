import React, { useContext, createContext } from "react"

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react"
import { ethers } from "ethers"
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk"

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  // my
  const { contract } = useContract("0x730Bd718DE5b829fAD9630Eae79A3d96Dc5136c5")
  // original
  // const { contract } = useContract('0xf59A1f8251864e1c5a6bD64020e3569be27e6AA9');
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  )

  const address = useAddress()
  const connect = useMetamask()

  // 创建活动
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      })

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  // 获取所有活动
  const getCampaigns = async() => {
    const campaigns = await contract.call('getCampaigns')

    const parseCampaigns = campaigns.map((campaign,i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }))

    console.log(campaigns,parseCampaigns)

    return parseCampaigns;
  }

  //  获取当前登录用户创建的活动
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns()

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address)

    return filteredCampaigns
  }

  // 众筹付款
  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], {
      value: ethers.utils.parseEther(amount)
    });

    return data;
  }

  // 获取某个活动的捐赠者和捐赠数量信息
  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators',[pId])
    console.log('---donations:', donations);
    const numberOfDonations = donations[0].length;

    const parseDonations = []

    for(let i=0; i < numberOfDonations; i++){
      parseDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parseDonations;
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
