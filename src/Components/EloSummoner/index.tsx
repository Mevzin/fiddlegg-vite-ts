interface IProps {
	src: string;
	tier?: string;
	rank?: string;
	queueType?: string;
	leaguePoints?: number;
}

const getTypeRank = (type: string) => {
	switch (type) {
		case "RANKED_FLEX_SR":
			return "Ranked Flex";
		case "RANKED_SOLO_5x5":
			return "Ranked Solo";
		default:
			return type;
	}
};

export const EloSummoner = ({ src, tier, rank, queueType, leaguePoints }: IProps) => {
	return (
		<div className="flex flex-col items-center text-center p-4rounded-lg">
			<img className="size-24" src={src} alt="Rank icon" />
			{queueType && (
				<span className="text-gray-300 text-sm font-medium mb-1">
					{getTypeRank(queueType)}
				</span>
			)}
			{tier && rank && (
				<span className="text-white text-lg font-bold mb-1">
					{tier} {rank}
				</span>
			)}
			{leaguePoints !== undefined && (
				<span className="text-blue-400 text-sm font-semibold">
					{leaguePoints} PDL
				</span>
			)}
		</div>
	);
};
