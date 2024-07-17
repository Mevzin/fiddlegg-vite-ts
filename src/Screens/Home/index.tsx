import { useState } from "react";
import { WrapperProfile } from "../../Components/WrapperProfile";
import IMAGES from "../../assets/Images";

export const Home = () => {
	const [summonerName, SetSummonerName] = useState("");
	const [summonerTagline, SetSummonerTagLine] = useState("");

	return (
		<div className="flex flex-col justify-center items-center h-96 w-6/12 rounded-lg mt-[25vh] bg-gray-800">
			<div className="flex mb-10">
				<img src={IMAGES.image2} />
				<img src={IMAGES.image1} />
			</div>
			<div className="flex h-10 text-center border-x-2 border-y-2 rounded-md">
				<input
					className=" bg-transparent text-cyan-100 text-center"
					type="text"
					name="nickName"
					id="nickName"
					placeholder="Game Name"
					onChange={(e) => {
						SetSummonerName(e.target.value);
					}}
				/>
				<input
					className=" bg-transparent text-cyan-100 text-center"
					type="text"
					name="tagLine"
					id="tagLine"
					placeholder="#"
					onChange={(e) => {
						SetSummonerTagLine(e.target.value);
					}}
				/>
			</div>
			<WrapperProfile
				namegame={summonerName}
				tagline={summonerTagline}
			></WrapperProfile>
		</div>
	);
};
