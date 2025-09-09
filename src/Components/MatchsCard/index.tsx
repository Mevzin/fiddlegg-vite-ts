import { useEffect, useState, useCallback, useRef } from "react";
import { apiBase } from "../../Service/api";
import IPlayer from "../../Models/player";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { calcAmA, calcCsMinute } from "../../Utils/functions";
import { Link } from "react-router-dom";
import { getChampionSplashUrl, getChampionIconUrl, getItemIconUrl } from "../../Service/dataDragonService";

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
	const [matches, setMatches] = useState<IMatch[]>([]);
	const [championUrls, setChampionUrls] = useState<Record<string, string>>({});
	const [championIconUrls, setChampionIconUrls] = useState<Record<string, string>>({});
	const [itemUrls, setItemUrls] = useState<Record<string, string>>({});
	const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [currentStart, setCurrentStart] = useState(0);
	const loadingRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (puuid) {
			setMatches([]);
			setCurrentStart(0);
			setHasMore(true);
			getMatches(puuid, 0, true);
		}
	}, [puuid]);

	const loadChampionUrl = async (championName: string) => {
		if (!championUrls[championName] && !loadingImages[`champion_${championName}`]) {
			setLoadingImages(prev => ({ ...prev, [`champion_${championName}`]: true }));
			try {
				const url = await getChampionSplashUrl(championName);
				setChampionUrls(prev => ({ ...prev, [championName]: url }));
			} catch (error) {
				console.error('Erro ao carregar splash do campeao:', error);
			} finally {
				setLoadingImages(prev => ({ ...prev, [`champion_${championName}`]: false }));
			}
		}
	};

	const loadChampionIconUrl = async (championName: string) => {
		if (!championIconUrls[championName] && !loadingImages[`champion_icon_${championName}`]) {
			setLoadingImages(prev => ({ ...prev, [`champion_icon_${championName}`]: true }));
			try {
				const url = await getChampionIconUrl(championName);
				setChampionIconUrls(prev => ({ ...prev, [championName]: url }));
			} catch (error) {
				console.error('Erro ao carregar ícone do campeão:', error);
			} finally {
				setLoadingImages(prev => ({ ...prev, [`champion_icon_${championName}`]: false }));
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
				console.error('Erro ao carregar icone do item:', error);
			} finally {
				setLoadingImages(prev => ({ ...prev, [`item_${itemId}`]: false }));
			}
		}
	};

	useEffect(() => {
		if (matches) {
			matches.forEach(match => {
				match.info.participants?.forEach(player => {
					const typedPlayer = player as IPlayer;
					loadChampionUrl(typedPlayer.championName);

					const items = [
						typedPlayer.item0,
						typedPlayer.item1,
						typedPlayer.item2,
						typedPlayer.item3,
						typedPlayer.item4,
						typedPlayer.item5,
						typedPlayer.item6
					];

					items.forEach(item => {
						if (item !== 0) loadItemUrl(item);
					});
				});
			});
		}
	}, [matches]);

	const getMatches = useCallback(async (puuid: string, start: number = 0, reset: boolean = false) => {
		if (!puuid) return;

		setIsLoading(true);
		try {
			const response = await apiBase.get(`/league/searchMatchs/${puuid}?start=${start}&count=10`);
			const { matchlist, pagination } = response.data;

			if (reset) {
				setMatches(matchlist);
			} else {
				setMatches(prev => [...prev, ...matchlist]);
			}

			setHasMore(pagination.hasMore);
			setCurrentStart(start + matchlist.length);
		} catch (error) {
			console.error('Erro ao carregar partidas:', error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const loadMore = useCallback(() => {
		if (puuid && !isLoading && hasMore) {
			getMatches(puuid, currentStart);
		}
	}, [puuid, currentStart, isLoading, hasMore, getMatches]);


	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);

		if (loadingRef.current) {
			observer.observe(loadingRef.current);
		}

		return () => observer.disconnect();
	}, [hasMore, isLoading, loadMore]);

	return (
		<div className="flex flex-col mt-8">
			{matches?.map((match, matchIndex) => (
				<div key={`match-${match.info.gameId}-${matchIndex}`}>
					{match.info.participants?.map((player: IPlayer, playerIndex) => (
						<div key={`${match.info.gameId}-player-${playerIndex}-${player.summonerName || player.puuid}`}>
							{player.puuid == puuid && (
								<div className={`flex flex-row border-solid border-2 rounded-xl items-center m-1 h-64 bg-gradient-to-l ${player.win
									? 'from-green-600/30 to-gray-600 border-green-500/50'
									: 'from-red-600/30 to-gray-600 border-red-500/50'
									}`}>
									<div className="flex flex-col justify-center items-center ml-2">
										<div className="size-20 rounded-md border bg-gray-700 flex items-center justify-center">

											<img
												className="rounded-md border object-cover"
												src={championIconUrls[player.championName]}
												alt={player.championName}
												style={{ objectPosition: 'center' }}
											/>


										</div>
									</div>
									<div className="flex flex-col">
										<div className="flex justify-center mb-2 text-center">
											<span className="font-bold text-white">
												<span className={player.win ? 'text-green-500' : 'text-red-500'}>
													{player.win ? 'Vitoria' : 'Derrota'}
												</span> * {player.lane} * {match.info.gameMode}
											</span>
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
									<div className="flex gap-8">
										<div className="flex flex-col">
											{match.info.participants?.map((players: IPlayer) => (
												<div key={`${match.info.gameId}-${players.puuid}`}>
													{players.teamId == player.teamId && (
														<div className="flex text-white font-bold gap-2 mb-1 items-center">
															{(loadChampionIconUrl(players.championName), championIconUrls[players.championName]) ? (
																<img
																	className="h-8 w-8 rounded-md border object-cover"
																	src={championIconUrls[players.championName]}
																	alt={players.championName}
																	style={{ objectPosition: 'center' }}
																/>
															) : (
																<div className="size-8 rounded-md border bg-gray-700 flex items-center justify-center">
																	{loadingImages[`champion_icon_${players.championName}`] ? (
																		<div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div>
																	) : (
																		<span className="text-white text-xs">{players.championName.slice(0, 2)}</span>
																	)}
																</div>
															)}
															<div className="flex flex-col">
																<Link to={`/league/${encodeURIComponent(players.riotIdGameName)}/${encodeURIComponent(players.riotIdTagline)}`}>
																	<span className={`text-sm ${players.puuid === puuid
																		? 'text-yellow-400'
																		: 'text-green-400'
																		}`}>
																		{players.riotIdGameName} <span className="text-gray-400">#{players.riotIdTagline}</span>
																	</span>
																</Link>
																<div className="flex gap-3 text-xs text-gray-300">
																	<span>KDA: {players.kills}/{players.deaths}/{players.assists}</span>
																	<span>CS: {players.totalMinionsKilled + players.neutralMinionsKilled}</span>
																	<span>Wards: {players.wardsPlaced}</span>
																</div>
															</div>
														</div>
													)}
												</div>
											))}
										</div>
										<div className="w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent mx-4"></div>
										<div className="flex flex-col">
											{match.info.participants?.map((players: IPlayer) => (
												<div key={`${match.info.gameId}-enemy-${players.puuid}`}>
													{players.teamId != player.teamId && (
														<div className="flex text-white font-bold gap-2 mb-1 items-center">
															{(loadChampionIconUrl(players.championName), championIconUrls[players.championName]) ? (
																<img
																	className="size-8 rounded-md border object-cover"
																	src={championIconUrls[players.championName]}
																	alt={players.championName}
																	style={{ objectPosition: 'center' }}
																/>
															) : (
																<div className="size-8 rounded-md border bg-gray-700 flex items-center justify-center">
																	{loadingImages[`champion_icon_${players.championName}`] ? (
																		<div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div>
																	) : (
																		<span className="text-white text-xs">{players.championName.slice(0, 2)}</span>
																	)}
																</div>
															)}
															<div className="flex flex-col">
																<Link to={`/league/${encodeURIComponent(players.riotIdGameName)}/${encodeURIComponent(players.riotIdTagline)}`}>
																	<span className="text-sm text-red-400">{players.riotIdGameName} <span className="text-gray-400">#{players.riotIdTagline}</span></span>
																</Link>
																<div className="flex gap-3 text-xs text-gray-300">
																	<span>KDA: {players.kills}/{players.deaths}/{players.assists}</span>
																	<span>CS: {players.totalMinionsKilled + players.neutralMinionsKilled}</span>
																	<span>Wards: {players.wardsPlaced}</span>
																</div>
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			))}


			<div ref={loadingRef} className="flex justify-center py-4">
				{isLoading && (
					<div className="flex items-center gap-2 text-white">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
						<span>Carregando mais partidas...</span>
					</div>
				)}
				{!hasMore && matches.length > 0 && (
					<span className="text-gray-400">Nao ha mais partidas para carregar</span>
				)}
			</div>
		</div>
	);
};
