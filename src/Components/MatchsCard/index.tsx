import { useEffect, useState } from "react";
import { apiBase } from "../../Service/api";
import IPlayer from "../../Models/player";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { calcAmA, calcCsMinute } from "../../Utils/functions";
import { Link } from "react-router-dom";
import { getChampionIconUrl, getItemIconUrl } from "../../Service/dataDragonService";


interface IProps {
	puuid: string | undefined;
}

interface IMatch {
	info: {
		gameId: string;
		gameDuration: number;
		participants: [];
		gameMode: string;
	};
}

export const MatchesCard = ({ puuid }: IProps) => {
	const [matches, setMatches] = useState<IMatch[]>();
	const [championUrls, setChampionUrls] = useState<Record<string, string>>({});
	const [itemUrls, setItemUrls] = useState<Record<string, string>>({});
	const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

	useEffect(() => {
		getMatches(puuid);
	}, [puuid]);

	const loadChampionUrl = async (championName: string) => {
		if (!championUrls[championName] && !loadingImages[`champion_${championName}`]) {
			setLoadingImages(prev => ({ ...prev, [`champion_${championName}`]: true }));
			try {
				const url = await getChampionIconUrl(championName);
				setChampionUrls(prev => ({ ...prev, [championName]: url }));
			} catch (error) {
				console.error(`Erro ao carregar ícone do campeão ${championName}:`, error);
			} finally {
				setLoadingImages(prev => ({ ...prev, [`champion_${championName}`]: false }));
			}
		}
	};

	const loadItemUrl = async (itemId: number) => {
		if (itemId !== 0 && !itemUrls[itemId] && !loadingImages[`item_${itemId}`]) {
			setLoadingImages(prev => ({ ...prev, [`item_${itemId}`]: true }));
			try {
				const url = await getItemIconUrl(itemId);
				setItemUrls(prev => ({ ...prev, [itemId]: url }));
			} catch (error) {
				console.error(`Erro ao carregar ícone do item ${itemId}:`, error);
			} finally {
				setLoadingImages(prev => ({ ...prev, [`item_${itemId}`]: false }));
			}
		}
	};

	useEffect(() => {
		if (matches) {
			matches.forEach(match => {
				match.info.participants?.forEach(player => {
					loadChampionUrl((player as IPlayer).championName);
					[(player as IPlayer).item0,
					(player as IPlayer).item1,
					(player as IPlayer).item2,
					(player as IPlayer).item3,
					(player as IPlayer).item4,
					(player as IPlayer).item5,
					(player as IPlayer).item6]
						.forEach(item => {
							if (item !== 0) loadItemUrl(item);
						});
				});
			});
		}
	}, [matches]);

	async function getMatches(puuid: string | undefined) {
		if (puuid == undefined) return;

		await apiBase
			.get(`/league/searchMatchs/${puuid}`)
			.then((res) => setMatches(res.data.matchlist));
	}
	return (
		<div className="flex flex-col mt-8 ">
			{matches?.map((match, matchIndex) => (
				<div key={`match-${match.info.gameId}-${matchIndex}`}>
					{match.info.participants?.map((player: IPlayer, playerIndex) => (
						<div key={`${match.info.gameId}-player-${playerIndex}-${player.summonerName || player.puuid}`}>
							{player.puuid == puuid && (
								<div className="flex flex-row border-solid border-2 rounded-xl items-center bg-gray-500 m-1 h-40">
									<div className="flex flex-col justify-center items-center ml-2">
										<span className="text-white font-bold">{player.championName.toUpperCase()}</span>
										{championUrls[player.championName] ? (
											<img
												className="size-24 rounded-full border-2 mt-1"
												src={championUrls[player.championName]}
												alt={player.championName}
											/>
										) : (
											<div className="size-24 rounded-full border-2 mt-1 bg-gray-700 flex items-center justify-center">
												{loadingImages[`champion_${player.championName}`] ? (
													<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
												) : (
													<span className="text-white text-xs text-center">{player.championName}</span>
												)}
											</div>
										)}
									</div>
									<div className="flex flex-col">
										<div className="flex justify-center mb-2 text-center">
											<span className="font-bold text-white"><span className={player.win ? 'text-green-500' : 'text-red-500'}>{player.win ? 'Vitoria' : 'Derrota'}</span> * {player.lane} * {match.info.gameMode}</span>
										</div>
										<div className="flex w-80 justify-between mx-4">
											{[player.item0, player.item1, player.item2, player.item3, player.item4, player.item5, player.item6].map((item, index) => {
												if (item !== 0) {
													loadItemUrl(item);
												}
												return (
													<div key={`${match.info.gameId}-${player.puuid}-item-${index}`} className="flex justify-center items-center">
														{item !== 0 ? (
															itemUrls[item] ? (
																<img
																	className="size-10"
																	src={itemUrls[item]}
																	alt={`Item ${item}`}
																/>
															) : (
																<div className="size-10 bg-gray-600 rounded flex items-center justify-center">
																	{loadingImages[`item_${item}`] ? (
																		<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
																	) : (
																		<span className="text-white text-xs">{item}</span>
																	)}
																</div>
															)
														) : (
															<MdOutlineImageNotSupported size={'2.5rem'} />
														)}
													</div>
												);
											})}
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
									<div>
										{match.info.participants?.map((players: IPlayer) => (
											<div key={`${match.info.gameId}-${players.puuid}`}>
												{players.teamId == player.teamId && (
													<div className="flex text-white font-bold gap-2 mb-1">
														{championUrls[players.championName] ? (
															<img
																className="size-6 rounded-sm border-2"
																src={championUrls[players.championName]}
																alt={players.championName}
															/>
														) : (
															<div className="size-6 rounded-sm border-2 bg-gray-700 flex items-center justify-center">
																{loadingImages[`champion_${players.championName}`] ? (
																	<div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div>
																) : (
																	<span className="text-white text-xs">{players.championName.slice(0, 2)}</span>
																)}
															</div>
														)}
														<Link to={`/league/${players.riotIdGameName}/${players.riotIdTagline}`}>
															<span>{players.riotIdGameName} <span className="text-gray-400">#{players.riotIdTagline}</span></span>
														</Link>
													</div>
												)}
											</div>
										))}
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
