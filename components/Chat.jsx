import { View, Text, ScrollView, ActivityIndicator, Pressable, Image } from 'react-native';
import { useState, useEffect} from 'react';
import Header from './Header';
import { Entypo, MaterialIcons, Feather } from 'react-native-vector-icons';
import getUserStories from '../utils/getUserStories';

const Chat = ({handleChatCam}) => {
  const circleSize = 60; 

  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true)
      const res = await getUserStories();
      setUserStories(res);
      setLoading(false)
    };
    fetchStories();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <Header header="Chat" />
      <View style={{ flex: 1, backgroundColor: 'rgb(243, 244, 246)' }}>
        <View
          style={{
            backgroundColor: '#00BFFF',
            borderRadius: circleSize / 2,
            width: circleSize,
            height: circleSize,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 90,
            right: 15,
            marginBottom: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
            zIndex: 99,
          }}
        >
          <Entypo name="new-message" size={25} color="white" />
        </View>
        <ScrollView className="flex-1 mb-28" showsVerticalScrollIndicator={false}>
          <View className="flex flex-row items-center justify-between gap-4 bg-white p-3 m-2 rounded-2xl">
              <View className="w-[60px] h-[60px] bg-yellow-200 rounded-full flex items-center justify-center">
                  <Entypo name='archive' size={30} color='black' />
              </View>
              <View className="flex-1">
                  <Text className="font-medium text-lg">Archived</Text>
              </View>
              <View className="items-center justify-center">
                  <Text className="text-xl tracking-widest font-semibold text-[#FFD700]">New</Text>
                  <Entypo name='new' size={25} color='#FFD700' />
              </View>
          </View>

          {loading ? <ActivityIndicator size='small' /> : (
              <>
                {userStories.map((item, index) => (
                  <View key={index} className="flex flex-row items-center justify-between gap-4 bg-white py-2 px-3 pr-5 border border-t-1 border-b-0   border-l-0  border-r-0 border-gray-200">
                      <View className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden">
                          <Image source={item.avatar !== '' ? item.avatar : require('../assets/avatars/user.png')} className="w-full h-full" />
                      </View>
                      <View className="flex-1">
                          <Text className="font-medium text-lg tracking-wider capitalize">{item.nickName}</Text>
                          <View className="flex flex-row items-center gap-2">
                              <MaterialIcons name= 'chat-bubble-outline' size={12} color="#00BFFF" className="transform scale-x-[-1]" />
                              <Text className="text-[11px] font-medium text-gray-500">Tap to chat</Text>
                          </View>
                      </View>
                      <Pressable onPress={handleChatCam}>
                          <Feather name='camera' size={20} color='#B0B0B0' />
                      </Pressable>
                  </View>
                ))}
              </> 
          )}

        </ScrollView>
      </View>
    </View>
  );
};

export default Chat;
