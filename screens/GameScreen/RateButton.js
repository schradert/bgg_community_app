import React from 'reactn';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fetchJSON } from '../../shared/HTTP';
import styles from './styles';

export default class RateButton extends React.Component {
	state = {
		objectId: null,
		collectionId: null,
		userRating: 'N/A'
	};

	componentDidMount = () => {
		const { game } = this.props;
		this.getUserGameDetails(game.objectId);
	};

	getUserGameDetails = async (objectId) => {
		const { userid } = this.global.bggCredentials;

		const url = `/api/collections?objectid=${objectId}&objecttype=thing&userid=${userid}`;
		const { items } = await fetchJSON(url);

		let collid = null,
			userRating = 'N/A';

		if (items.length > 0) {
			[ { collid, userRating } ] = items;
		}

		this.setState({
			collectionId: collid,
			userRating: userRating,
			objectId
		});
	};

	render = () => {
		const { game, navigation: { navigate } } = this.props;

		const { collectionId, userRating } = this.state;

		const isRated = userRating !== 'N/A';

		const icon = isRated ? (
			<FontAwesome name="star" color="yellow" size={18} />
		) : (
			<FontAwesome name="star-o" color="yellow" size={18} />
		);

		return (
			<Button
				buttonStyle={styles.headerButton}
				titleStyle={styles.headerButtonText}
				containerStyle={{
					...styles.headerButtonContainer
				}}
				icon={icon}
				onPress={() =>
					navigate('Rate', {
						game,
						collectionId,
						userRating
					})}
				title={isRated ? ' Rate Game' : ` ${userRating}`}
			/>
		);
	};
}

RateButton.propTypes = {
	game: PropTypes.object.isRequired,
	navigation: PropTypes.shape({
		navigate: PropTypes.func.isRequired
	}).isRequired
};
