import { useEffect, useState } from "react";
import { apiBase } from "../../Service/api";
import IPlayer from "../../Models/player";

interface IProps {
	puuid: string | undefined;
}

interface IMatch {
	info: {
		gameId: string;
		participants: [];
	};
}

export const MatchsCard = ({ puuid }: IProps) => {
	const [matchs, setMatchs] = useState<IMatch[]>();
	const dragonURLItens =
		"http://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/";
	const dragonURLChampions =
		"https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/";

	useEffect(() => {
		getMatchs(puuid);
	}, [puuid]);

	async function getMatchs(puuid: string | undefined) {
		await apiBase
			.get(`/league/searchMatchs/${puuid}`)
			.then((res) => setMatchs(res.data.matchlist));
	}

	console.log(matchs);
	return (
		<div className="flex flex-col mt-8 ">
			{matchs?.map((match) => (
				<div key={match.info.gameId}>
					{match.info.participants?.map((player: IPlayer) => (
						<div key={player.summonerName}>
							{player.puuid == puuid && (
								<div className="flex flex-row border-solid border-2 rounded-xl items-center bg-gray-500 m-1 h-40">
									<div className="flex flex-col justify-center items-center ml-2">
										<span>{player.championName}</span>
										<img
											className="size-24 rounded-full border-2 mt-2"
											src={`${dragonURLChampions}${player.championName}.png`}
										/>
									</div>

									<div className="flex w-80 justify-between ml-4">
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item0}.png`}
										/>
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item1}.png`}
										/>
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item2}.png`}
										/>
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item3}.png`}
										/>
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item4}.png`}
										/>
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item5}.png`}
										/>
										<img
											className="size-10"
											src={`${dragonURLItens}${player.item6}.png`}
										/>
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
