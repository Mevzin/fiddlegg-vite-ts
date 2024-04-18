import { useEffect, useState } from "react";
import { apiBase } from "../../Service/api";
import { RankImage, getTypeRank } from "../../Utils/functions";

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
			.get(`league/getRankProfile/${id}`)
			.then((res) => setRanks(res.data.rank));
	}

	useEffect(() => {
		getAccountRank(id);
	}, [id]);

	return (
		<div className="flex flex-col justify-center items-center text-center w-full h-1/2 border-solid border-2 rounded-2xl m-4 bg-gray-500">
			{ranks?.map((rank: IRank) => (
				<div className="flex flex-col text-white" key={rank.leagueId}>
					{RankImage(rank.tier)}
					<span>{getTypeRank(rank.queueType)}</span>
					<span>
						{rank.tier} {rank.rank}
					</span>
				</div>
			))}
		</div>
	);
};
