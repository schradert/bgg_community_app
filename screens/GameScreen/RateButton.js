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
		ratingStatus: {}
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
			status = null,
			wishlistpriority;

		if (items.length > 0) {
			[ { collid, status, wishlistpriority } ] = items;
		}

		// fallback
		status = status ? status : {};

		this.setState({
			collectionId: collid,
			collectionStatus: status,
			objectId
		});
	};

	render = () => {
		const { game, navigation: { navigate } } = this.props;

		const { collectionId, ratingStatus } = this.state;

		const isRated = Object.keys(ratingStatus).length > 0;

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
					navigate('AddTo', {
						game,
						collectionId,
						collectionStatus,
						wishlistPriority
					})}
				title={isRated ? ' Rate Game' : ` ${rating}`}
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
