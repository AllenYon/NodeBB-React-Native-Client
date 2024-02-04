import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  getNotifications,
  getPopularTopics,
  getRecentTopics,
  getTopics,
} from '../service/apis.tsx';

import {
  Category,
  Notification,
  QuestionEntity,
  ThreadEntity,
  Topic,
} from '../types.tsx';
import COLORS from '../colors.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import SeparatorLine from '../component/SeparatorLine.tsx';
import NotificationItemView from '../component/NotificationItemView.tsx';
import HeaderView from '../component/HeaderView.tsx';

interface NotificationsViewProps {}

const NotificationsView: React.FC<NotificationsViewProps> = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const result = await getNotifications();
      console.log('NotificationsView. result', result.notifications);
      return result.notifications;
    },
  });

  const renderSeparator = () => <SeparatorLine />;
  const renderItem: ListRenderItem<Notification> = ({item}) => {
    return <NotificationItemView data={item} />;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/notifications'],
    });
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 44,
      }}>
      <HeaderView title={'Notifications'} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

export default NotificationsView;