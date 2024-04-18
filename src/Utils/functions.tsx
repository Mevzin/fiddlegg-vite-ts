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

export const getTypeRank = (type: string) => {
	switch (type) {
		case "RANKED_FLEX_SR":
			return "Ranked Flex";
		case "RANKED_SOLO_5x5":
			return "Ranked Solo";
	}
};
