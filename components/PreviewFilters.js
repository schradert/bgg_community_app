import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { TagSelect } from 'react-native-tag-select'
import { Button } from 'react-native-elements'
import RadioForm from 'react-native-simple-radio-button'

import styles from '../shared/styles'
import { priorities, halls, seen } from '../shared/data'

export default class PreviewFilters extends React.Component {
  state = {
    filters: {},
    sortBy: 'publisherGame'
  }

  toggleTags = name => {
    const select = this[name]

    const value = select.props.data.reduce((ids, item) => {
      ids[item.id] = item.id
      return ids
    }, {})

    if (select.state.value.length === 0) {
      select.setState({ value })
    } else {
      select.setState({ value: [] })
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { filters, sortBy } = props.navigation.state.params
    if (filters !== state.filters || sortBy !== state.sortBy) {
      return { filters, sortBy }
    } else {
      return null
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          onPress={navigation.state.params.applyFilters}
          title="Apply"
          buttonStyle={{ backgroundColor: '#03A9F4' }}
        />
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      applyFilters: this.applyFilters
    })
  }

  applyFilters = () => {
    const { setFilters } = this.props.navigation.state.params
    const { pop } = this.props.navigation

    setFilters(
      {
        priorities: this.priorityTags.itemsSelected.map(
          priority => priority.id || priority
        ),
        halls: this.hallTags.itemsSelected.map(hall => hall.id || hall),
        seen: this.seenTags.itemsSelected.map(seen => seen.id || seen)
      },
      this.state.sortBy
    )

    pop()
  }

  render = () => {
    const { pop } = this.props.navigation
    const { filters, sortBy } = this.state
    const { setFilters, defaultFilters } = this.props.navigation.state.params

    const sortingOptions = [
      { label: 'Publisher, Game', value: 'publisherGame' },
      { label: 'Location, Publisher, Game', value: 'locationPublisherGame' }
    ]

    const sortIndex = sortingOptions.findIndex(
      sortOpt => sortOpt.value === sortBy
    )

    return (
      <ScrollView>
        <View style={styles.mainView}>
          <Text style={styles.formHeader}>Sorting</Text>
          <View style={{ padding: 5 }}>
            <RadioForm
              radio_props={sortingOptions}
              initial={sortIndex}
              onPress={value => this.setState({ sortBy: value })}
            />
          </View>
          <Text style={styles.formHeader}>Filters</Text>
          <View style={{ padding: 5 }}>
            <TouchableOpacity
              style={styles.formLabelRow}
              onPress={() => this.toggleTags('priorityTags')}
            >
              <Text style={styles.formLabel}>Priority</Text>
              <Text style={styles.toggleText}>(Toggle All)</Text>
            </TouchableOpacity>

            <View style={{ marginLeft: 5 }}>
              <TagSelect
                labelAttr="name"
                value={filters.priorities}
                ref={tag => {
                  this.priorityTags = tag
                }}
                data={priorities}
                theme="info"
              />
            </View>

            <TouchableOpacity
              style={styles.formLabelRow}
              onPress={() => this.toggleTags('hallTags')}
            >
              <Text style={styles.formLabel}>Halls</Text>
              <Text style={styles.toggleText}>(Toggle All)</Text>
            </TouchableOpacity>

            <View style={{ marginLeft: 5 }}>
              <TagSelect
                labelAttr="name"
                value={filters.halls}
                ref={tag => {
                  this.hallTags = tag
                }}
                data={halls}
                theme="info"
              />
            </View>

            <TouchableOpacity
              style={styles.formLabelRow}
              onPress={() => this.toggleTags('seenTags')}
            >
              <Text style={styles.formLabel}>Viewed</Text>
              <Text style={styles.toggleText}>(Toggle All)</Text>
            </TouchableOpacity>

            <View style={{ marginLeft: 5 }}>
              <TagSelect
                labelAttr="name"
                value={filters.seen}
                ref={tag => {
                  this.seenTags = tag
                }}
                data={seen}
                theme="info"
              />
            </View>

            <View style={styles.formButtons}>
              <Button
                style={{ flex: 1 }}
                backgroundColor="#03A9F4"
                title="Apply Filters"
                onPress={this.applyFilters}
              />
              <Button
                style={{ flex: 1 }}
                title="Reset"
                onPress={() => {
                  this.setState({ filters: defaultFilters })

                  this.priorityTags.setState({ value: [] })
                  this.hallTags.setState({ value: [] })
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}
