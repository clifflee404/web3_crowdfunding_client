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

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns()

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address)

    return filteredCampaigns
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
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
