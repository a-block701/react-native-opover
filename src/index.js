import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import PopoverTooltip from 'react-native-popover-tooltip';
import { Images, Icons } from '@AppTheme';
import { SideMenu, Text, Button, StaxListItem } from '../../../components';
import styles from './styles';
import { staxActions } from '../../../redux/actions';
import { StaxItemHorizontal } from '../components';
import { formatAmount } from '../../../utils';

const { width } = Dimensions.get('window');

const adData = {
  heading: 'TheXchange Banner',
  content:
    'Lorem ipsum dolor sit amet consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna',
  image:
    'https://image.shutterstock.com/shutterstock/photos/1529923664/display_1500/stock-photo-waves-of-water-of-the-river-and-the-sea-meet-each-other-during-high-tide-and-low-tide-whirlpools-1529923664.jpg',
};
class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 1,
      showAd: true,
      refsArray: [],
      activeStax: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // this.loadPortfolioDetail();
      this.searchStax();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  searchStax = () => {
    const { dispatch, activeSubxchange } = this.props;
    dispatch(
      staxActions.searchStax({
        subxchange: activeSubxchange?.id,
        limit: 100,
        sortBy: 'new',
        type: 'all',
      }),
    );
  };

  loadPortfolioDetail = async () => {
    const { subxchanges } = this.props;
    const subxchangeId =
      subxchanges && subxchanges.length > 0 && subxchanges[0].id;
    this.props.dispatch(staxActions.getPortfolio(subxchangeId));
  };

  handleChangeTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleShowAD = () => {
    this.setState({ showAd: false });
  };

  handlePressItem = (item) => {
    this.props.navigation.navigate('IssuerPortfolio', { staxId: item.id });
  };

  renderDepositView() {
    return (
      <View style={styles.bannerView}>
        <Image
          source={Images.homeBanner}
          style={styles.banner}
          resizeMode="cover"
        />
        <Text style={styles.bannerTitle}>Let's fund your account!</Text>
        <Text style={styles.bannerText}>
          Start building your portfolio today!
        </Text>
        <Button
          title={'Deposit Funds'}
          style={styles.depositButton}
          textStyle={styles.deposityButtonText}
          onPress={() => this.props.navigation.navigate('Cash')}
        />
      </View>
    );
  }

  renderBuyStaxView() {
    return (
      <View>
        <View style={[styles.row]}>
          <View>
            <Text style={styles.bannerText}>My Portfolio</Text>
            <View style={[styles.row, { justifyContent: 'flex-start', marginTop: 5 }]}>
              <Image source={Icons.unicorn} />
              <Text style={styles.priceText}>{` ${formatAmount(Number(0))}`}</Text>
            </View>
          </View>
          <PopoverTooltip
            ref='tooltip4'
            buttonComponent={
              <Image source={Icons.iconList} />
            }
            items={[
              {
                label: 'Trade Mode',
                onPress: () => { }
              },
              {
                label: 'Orders & History',
                onPress: () => { }
              }
            ]}
            setBelow={true}
            animationType='spring'
            overlayStyle={{ backgroundColor: 'transparent' }} // set the overlay invisible
            tooltipContainerStyle={{
              borderRadius: 8,
              borderColor: '#707070',
              backgroundColor: '#191919',
              paddingLeft: 10,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            labelContainerStyle={{
              width: 160,
              alignItems: 'flex-start',
            }}
            labelSeparatorColor='#191919'
            labelStyle={{ color: '#FFF'}}
          />
        </View>
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>Welcome to Fantasy Mode!</Text>
          <Text style={styles.bannerText}>
            {'Lorem ipsum dolor sit amet,\nconsetetur sadipscing elitr, sed'}
          </Text>
          <Button
            title={'Buy Stax'}
            style={styles.buyButton}
            textStyle={styles.deposityButtonText}
            onPress={() => this.props.navigation.navigate('Cash')}
          />
        </View>
        <View style={styles.divider} />
        <View style={[styles.row]}>
          <Text style={styles.bannerText}>Fantasy Cash</Text>
          <View>
            <View style={[styles.row]}>
              <Image source={Icons.unicorn} style={{ marginTop: 5 }} />
              <Text style={styles.bannerText}>{formatAmount(Number(this.props.cashBalance))}</Text>
              <Image source={Icons.help} style={{ marginLeft: 5, marginTop: 5 }} />
            </View>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  renderAD() {
    return (
      <View style={styles.adView}>
        <Image
          style={styles.adImage}
          source={{ uri: adData.image }}
          resizeMode="cover"
        />
        <View style={styles.adSubView}>
          <View style={styles.row}>
            <Text style={styles.adTitle}>{adData.heading}</Text>
            <TouchableOpacity onPress={this.handleShowAD}>
              <Image source={Icons.cancel} />
            </TouchableOpacity>
          </View>
          <Text style={styles.adLabel}>{adData.content}</Text>
        </View>
      </View>
    );
  }

  renderTile = ({ item, index }) => {
    return (
      <View style={{ width: width / 3 }}>
        <StaxItemHorizontal
          data={item}
          onPress={() => this.handlePressItem(item)}
        />
      </View>
    );
  };

  renderList = ({ item, index }) => {
    return (
      <StaxListItem
        data={item}
        index={index}
        refsArray={this.state.refsArray}
        showTradeButtons={this.state.activeStax === item.id}
      />
    );
  };

  renderFavorite() {
    const { staxes } = this.props;
    const favoriteStaxes = staxes.filter((item) => item.followed === 1);
    return (
      <View style={styles.favoriteVeiw}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>My Favorites</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Stax')}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          bounces={false}
          data={favoriteStaxes}
          renderItem={this.renderTile}
          keyExtractor={(item) => item.id}
          key={'grid'}
        />
      </View>
    );
  }

  renderTopPerformers() {
    const { staxes } = this.props;
    const topStaxes = staxes.filter((item) => item.verified === true);
    return (
      <View style={styles.favoriteVeiw}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Top Performers</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Stax')}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          bounces={false}
          data={topStaxes}
          renderItem={this.renderTile}
          keyExtractor={(item) => item.id}
          key={'grid'}
        />
      </View>
    );
  }

  renderAuctions() {
    const { staxes, isoStatus } = this.props;
    const { activeStax } = this.state;
    const auctionStaxes = staxes.filter((item) => {
      const isoInfo = isoStatus[`${item.ticker}USD`];
      if (!isoInfo) {
        return false;
      }
      if (isoInfo.state === 2) {
        return true;
      }
      return false;
    });
    return (
      <View style={styles.favoriteVeiw}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Auctions</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Stax')}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={auctionStaxes}
          renderItem={this.renderList}
          numColumns={1}
          keyExtractor={(_item) => _item.id}
          key={'list'}
          style={styles.list}
          extraData={activeStax}
        />
      </View>
    );
  }

  render() {
    const title = 'HOME';
    const { showAd } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <SideMenu headerProps={{ title: '', showDropdown: true }} title={title}>
          <ScrollView
            style={styles.bodyContent}
            contentContainerStyle={styles.bodyContentContainer}
          >
            {false ? this.renderDepositView() : this.renderBuyStaxView()}
            {!!showAd && this.renderAD()}
            {this.renderFavorite()}
            {this.renderTopPerformers()}
            {this.renderAuctions()}
          </ScrollView>
        </SideMenu>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ global, stax }) => {
  return {
    activeSubxchange: global.activeSubxchange,
    subxchanges: global.subxchanges,
    staxes: stax.staxes,
    isoStatus: stax.isoStatus,
    cashBalance: stax.cashBalance,
  };
};

export default connect(mapStateToProps)(HomeScreen);
