import { useEffect, useState } from "react";
import { apiBase } from "../../Service/api";
import { RankImageWithData } from "../../Utils/functions";

interface IProps {
	id: string | undefined;
}

interface IRank {
	leagueId: string;
	queueType: string;
	tier: string;
	rank: string;
	summonerId: string;
	leaguePoints: number;
	wins: number;
	losses: number;
	veteran: string;
	inactive: string;
	freshBlood: string;
	hotStreak: string;
}

export const RankCard = ({ id }: IProps) => {
	const [ranks, setRanks] = useState<IRank[]>();

	async function getAccountRank(id: string | undefined) {
		if (id == undefined) return;
		await apiBase
			.get(`/league/getRankProfile/${id}`)
			.then((res) => {
				setRanks(res.data.rank);
			})
			.catch((error) => {
				console.error('Erro ao buscar rank:', error);
			});
	}

	useEffect(() => {
		getAccountRank(id);
	}, [id]);

	return (
		<div className="flex flex-col justify-center items-center text-center w-full h-96 border-solid border-2 rounded-2xl m-4 bg-gray-700 gap-4">
			{!ranks && (
				<div className="text-white">Carregando ranks...</div>
			)}
			{ranks && ranks.length === 0 && (
				<div className="text-white">Nenhum rank encontrado</div>
			)}
			{ranks?.map((rank: IRank) => (
				<div key={rank.leagueId}>
					{RankImageWithData({
						tier: rank.tier,
						rank: rank.rank,
						queueType: rank.queueType,
						leaguePoints: rank.leaguePoints
					})}
				</div>
			))}
		</div>
	);
};
