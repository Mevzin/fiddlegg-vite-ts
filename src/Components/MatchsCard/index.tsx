import { useEffect, useState } from "react";
import { apiBase } from "../../Service/api";
import IPlayer from "../../Models/player";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { calcAmA, calcCsMinute } from "../../Utils/functions";


interface IProps {
	puuid: string | undefined;
}

interface IMatch {
	info: {
		gameId: string;
		gameDuration: number;
		participants: [];
	};
}

export const MatchesCard = ({ puuid }: IProps) => {
	const [matches, setMatches] = useState<IMatch[]>();
	const dragonURLItems =
		"http://ddragon.leagueoflegends.com/cdn/14.14.1/img/item/";
	const dragonURLChampions =
		"https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/";

	useEffect(() => {
		getMatches(puuid);
	}, [puuid]);

	async function getMatches(puuid: string | undefined) {
		if (puuid == undefined) return;

		await apiBase
			.get(`/league/searchMatchs/${puuid}`)
			.then((res) => setMatches(res.data.matchlist));
	}

	return (
		<div className="flex flex-col mt-8 ">
			{matches?.map((match) => (
				<div key={match.info.gameId}>
					{match.info.participants?.map((player: IPlayer) => (
						<div key={player.summonerName}>
							{player.puuid == puuid && (
								<div className="flex flex-row border-solid border-2 rounded-xl items-center bg-gray-500 m-1 h-40">
									<div className="flex flex-col justify-center items-center ml-2">
										<span className="text-white font-bold">{player.championName.toUpperCase()}</span>
										<img
											className="size-24 rounded-full border-2 mt-1"
											src={`${dragonURLChampions}${player.championName}.png`}
										/>
									</div>
									<div className="flex flex-col">
										<div className="flex w-80 justify-between mx-4">
											{player.item0 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item0}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}
											{player.item1 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item1}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}
											{player.item2 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item2}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}
											{player.item3 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item3}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}
											{player.item4 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item4}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}
											{player.item5 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item5}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}

											{player.item6 != 0 ? (<img
												className="size-10"
												src={`${dragonURLItems}${player.item6}.png`}
											/>) : (
												<MdOutlineImageNotSupported size={'2.5rem'} />
											)}

										</div>
										<div className="flex my-2 justify-evenly items-center">
											<div className="flex flex-col justify-center items-center text-white font-bold">
												<span>K/D/A</span>
												<span>{player.kills}/{player.deaths}/{player.assists}</span>
											</div>
											<div className="flex flex-col justify-center items-center text-white font-bold">
												<span>Cs</span>
												<span>{player.totalMinionsKilled + player.neutralMinionsKilled} cs</span>
											</div>
											<div className="flex flex-col justify-center items-center text-white font-bold">
												<span>AMA</span>
												<span>{calcAmA(player.kills, player.assists, player.deaths)}</span>
											</div>
											<div className="flex flex-col justify-center items-center text-white font-bold">
												<span>Cs/Min</span>
												<span>{calcCsMinute(match.info.gameDuration, player.totalMinionsKilled + player.neutralMinionsKilled)}</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	);
};
