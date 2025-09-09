import { EloSummoner } from "../Components/EloSummoner";

import iron from "../assets/ranksimages/Iron.png";
import bronze from "../assets/ranksimages/Bronze.png";
import silver from "../assets/ranksimages/Silver.png";
import gold from "../assets/ranksimages/Gold.png";
import platinum from "../assets/ranksimages/Platinum.png";
import diamond from "../assets/ranksimages/Diamond.png";
import grandmaster from "../assets/ranksimages/Grandmaster.png";
import master from "../assets/ranksimages/Master.png";
import challenger from "../assets/ranksimages/Challenger.png";
import emerald from "../assets/ranksimages/emerald.png";

export const RankImage = (rank: string) => {
	switch (rank) {
		case "BRONZE":
			return <EloSummoner src={bronze} />;
		case "IRON":
			return <EloSummoner src={iron} />;
		case "SILVER":
			return <EloSummoner src={silver} />;
		case "GOLD":
			return <EloSummoner src={gold} />;
		case "PLATINUM":
			return <EloSummoner src={platinum} />;
		case "DIAMOND":
			return <EloSummoner src={diamond} />;
		case "GRANDMASTER":
			return <EloSummoner src={grandmaster} />;
		case "MASTER":
			return <EloSummoner src={master} />;
		case "CHALLENGER":
			return <EloSummoner src={challenger} />;
		case "EMERALD":
			return <EloSummoner src={emerald} />;
	}
};

interface IRankData {
	tier: string;
	rank: string;
	queueType: string;
	leaguePoints: number;
}

export const RankImageWithData = (rankData: IRankData) => {
	const { tier, rank, queueType, leaguePoints } = rankData;

	switch (tier) {
		case "BRONZE":
			return <EloSummoner src={bronze} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "IRON":
			return <EloSummoner src={iron} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "SILVER":
			return <EloSummoner src={silver} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "GOLD":
			return <EloSummoner src={gold} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "PLATINUM":
			return <EloSummoner src={platinum} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "DIAMOND":
			return <EloSummoner src={diamond} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "GRANDMASTER":
			return <EloSummoner src={grandmaster} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "MASTER":
			return <EloSummoner src={master} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "CHALLENGER":
			return <EloSummoner src={challenger} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		case "EMERALD":
			return <EloSummoner src={emerald} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
		default:
			return <EloSummoner src={iron} tier={tier} rank={rank} queueType={queueType} leaguePoints={leaguePoints} />;
	}
};

export const getTypeRank = (type: string) => {
	switch (type) {
		case "RANKED_FLEX_SR":
			return "Ranked Flex";
		case "RANKED_SOLO_5x5":
			return "Ranked Solo";
	}
};

export const calcAmA = (kills: number, assits: number, deaths: number) => {
	const result = ((kills + assits) / deaths).toFixed(2);
	return result
}

export const calcMatchTime = (time: number) => {
	const d = new Date(1000 * Math.round(time / 1000));
	function pad(i: number): string {
		return ('0' + i).slice(-2);
	}
	const str = pad(d.getUTCMinutes()) + 'min ' + pad(d.getUTCSeconds()) + "sec";
	return str;
}

export const calcCsMinute = (time: number, cs: number) => {
	const d = new Date(1000 * Math.round(time / 1000));
	function pad(i: number) {
		return ('0' + i).slice(-2);
	}
	const min: string = pad(d.getUTCSeconds())

	const mediaCs = cs / parseInt(min)
	return mediaCs.toFixed(2);
}