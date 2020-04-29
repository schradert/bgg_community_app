import React, { useDispatch } from 'reactn';
import { View, Text } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { Dropdown } from 'react-native-material-dropdown';
import PropTypes from 'prop-types';

import { fetchJSON } from '../../shared/HTTP';
import globalStyles from '../../shared/styles';
import styles from './styles';

const RateGame = ({ navigation, route }) => {
	const [ userRating, setUserRating ] = React.useState(route.params.userRating);

	const addOrUpdateGameInCollection = useDispatch('addOrUpdateGameInCollection');

	save = async () => {
		const { game, collectionId } = route.params;

		const body = {
			item: {
				collid: collectionId || 0,
				status: collectionStatus,
				objectid: game.objectId.toString(),
				objectname: game.name,
				objecttype: 'thing',
				acquisitiondate: null,
				invdate: null,
				wishlistpriority: wishlistPriority
			}
		};

		let response, success;
		if (collectionId) {
			const url = `/api/collectionitems/${collectionId}`;
			response = await fetchJSON(url, { method: 'PUT', body });

			success = response.message === 'Item updated';
		} else {
			const url = '/api/collectionitems';
			response = await fetchJSON(url, { method: 'POST', body });
			success = response.message === 'Item saved';
		}

		if (success) {
			//update global / store
			if (Object.values(collectionStatus).some((state) => state)) {
				game.status = {};

				Object.keys(collectionStatus).map((key) => {
					game.status[key] = collectionStatus[key] ? '1' : '0';
				});

				addOrUpdateGameInCollection(game);
			} else {
				removeGameFromCollection(game);
			}

			navigation.goBack(null);
		} else {
			showMessage({
				message: "Failed to save item's rating, please try again.",
				icon: 'auto',
				type: 'danger'
			});
		}
	};

	React.useLayoutEffect(
		() => {
			navigation.setOptions({
				headerRight: () => <Button small onPress={save} title="Save" buttonStyle={globalStyles.headerButton} />
			});
		},
		[ navigation, save ]
	);

	ratingStates = [
		[ 'Awful - defies game description.', '1' ],
		[ "Very Bad - won't play ever again.", '2' ],
		[ "Bad - likely won't play this again.", '3' ],
		[ 'Not so good - but could play again.', '4' ],
		[ 'Mediocre - take it or leave it.', '5' ],
		[ 'Ok - will play if in the mood.', '6' ],
		[ 'Good - usually willing to play.', '7' ],
		[ 'Very Good - enjoying play and would suggest it.', '8' ],
		[ 'Excellent - very much enjoy playing.', '9' ],
		[ 'Outstanding - will always enjoy playing.', '10' ]
	];

	toggle = (attr) => {
		let currentState = collectionStatus[attr];
		setCollectionStatus({ ...collectionStatus, [attr]: !currentState });
	};

	_renderWishlistDropdown = (wishedFor) => {
		return wishedFor ? (
			<View style={styles.wishlistDropDownWrapper}>
				<Dropdown
					dropdownOffset={{ top: 8, left: 0 }}
					itemCount={6}
					data={wishlistValues}
					value={wishlistPriority}
					onChangeText={(value) => setWishlistPriority(value)}
				/>
			</View>
		) : null;
	};

	const { name } = route.params.game;

	let statusCheckBoxes = collectionStates.map((status, i) => (
		<CheckBox
			containerStyle={styles.checkboxContainer}
			title={status[0]}
			key={i}
			checked={collectionStatus[status[1]]}
			onPress={() => {
				toggle(status[1]);
			}}
		/>
	));

	return (
		<View style={styles.main}>
			<Text style={styles.gameName}>{name}</Text>

			{statusCheckBoxes}

			{_renderWishlistDropdown(collectionStatus.wishlist)}
		</View>
	);
};

GameAddTo.propTypes = {
	navigation: PropTypes.shape({
		navigate: PropTypes.func.isRequired,
		setParams: PropTypes.func.isRequired
	}).isRequired,
	route: PropTypes.shape({
		params: PropTypes.shape({
			game: PropTypes.object.isRequired,
			collectionId: PropTypes.string,
			collectionStatus: PropTypes.any,
			wishlistPriority: PropTypes.number
		})
	})
};

export default GameAddTo;
