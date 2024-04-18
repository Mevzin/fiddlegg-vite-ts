import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { apiBase } from "../../Service/api";
import { IProfile } from "../../Models/profile";
import { FaArrowRight } from "react-icons/fa";
import { ISummoner } from "../../Models/summoner";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

export const WrapperProfile = (props: IProfile) => {
	const [summoner, setSummoner] = useState<ISummoner>();
	const dataLink: string =
		"https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon";

	useEffect(() => {
		searchSummoner(props.namegame, props.tagline);
	}, [props.namegame, props.tagline]);

	async function searchSummoner(name: string, tag: string) {
		if (!name || !tag) return;

		await apiBase
			.get(`/league/searchUser/${name}/${tag}`)
			.then((res) => {
				setSummoner(res.data);
			})
			.catch((e) => {
				console.error(e);
				setSummoner(undefined);
				toast.error("Jogador não encontrado", {
					position: "top-right",
					icon: false,
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
					transition: Bounce,
				});
			});

		return;
	}

	return (
		<>
			{summoner != undefined && (
				<div className="flex justify-between items-center w-80 h-16 border-2 mt-5 rounded-md text-zinc-50 ">
					<img
						className="w-14 rounded-full border-1"
						src={`${dataLink}/${summoner?.profileIconId}.png`}
					/>
					<div className="items-start w-44">
						<h1>
							{summoner?.gameName} #{summoner?.tagLine}
						</h1>
						<h1>Level: {summoner?.summonerLevel}</h1>
					</div>
					<div className="flex h-full w-11 bg-green-500 items-center justify-center hoverShowPage">
						<FaArrowRight />
					</div>
				</div>
			)}
			<ToastContainer />
		</>
	);
};
