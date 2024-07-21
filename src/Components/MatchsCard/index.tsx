import { useEffect, useState } from "react";
import { apiBase } from "../../Service/api";
import IPlayer from "../../Models/player";
import { MdOutlineImageNotSupported } from "react-icons/md";


interface IProps {
	puuid: string | undefined;
}

interface IMatch {
	info: {
		gameId: string;
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
										<span>{player.championName}</span>
										<img
											className="size-24 rounded-full border-2 mt-2"
											src={`${dragonURLChampions}${player.championName}.png`}
										/>
									</div>

									<div className="flex w-80 justify-between ml-4">
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
								</div>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	);
};
