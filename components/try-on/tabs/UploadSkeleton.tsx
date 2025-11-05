import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Upload } from 'lucide-react-native'
import { Colors } from '@/constants'

const UploadSkeleton = ({title}) => {
  return (
    <View>
      <TouchableOpacity className="flex items-center justify-center border-2 border-virtual-primary-light border-dotted p-10 rounded-xl gap-4">
            <Upload size={48} color={Colors.gray[400]} />
            <Text className="text-virtual-primary font-semibold text-base">
              {title}
            </Text>
          </TouchableOpacity>
    </View>
  )
}

export default UploadSkeleton